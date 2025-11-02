import fs from 'fs';
import path from 'path';

const SOURCE_PATH = path.resolve('./src');
const MODEL_PATH = path.join(SOURCE_PATH, 'Model');
const VIEW_PATH = path.join(SOURCE_PATH, 'View');
const CONTROLLER_PATH = path.join(SOURCE_PATH, 'Controller');
const UTIL_PATH = path.join(SOURCE_PATH, 'Util');

function getAllJavaScriptFiles(baseDirectory) {
  const entries = fs.readdirSync(baseDirectory);

  return entries
    .flatMap((entry) => {
      const entryPath = path.join(baseDirectory, entry);
      const isDirectory = fs.statSync(entryPath).isDirectory();
      return isDirectory ? getAllJavaScriptFiles(entryPath) : entryPath;
    })
    .filter((filePath) => filePath.endsWith('.js'));
}

function getImportPathsFromFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const importPattern = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  const importPaths = [];

  let match;
  while ((match = importPattern.exec(fileContent)) !== null) {
    importPaths.push(match[1]);
  }

  return importPaths;
}

describe('프로젝트 구조 규칙 검사 (MVC 의존성)', () => {
  const modelFiles = getAllJavaScriptFiles(MODEL_PATH);
  const viewFiles = getAllJavaScriptFiles(VIEW_PATH);
  const controllerFiles = getAllJavaScriptFiles(CONTROLLER_PATH);

  test('✅ Model은 Controller와 View에만 의존하지 않아야 한다 (Util 허용)', () => {
    modelFiles.forEach((modelFilePath) => {
      const importPaths = getImportPathsFromFile(modelFilePath);
      importPaths.forEach((importPath) => {
        const isInvalidDependency =
          importPath.includes('Controller') || importPath.includes('View');

        if (isInvalidDependency) {
          throw new Error(
            `[❌] ${modelFilePath} 파일이 잘못된 의존성을 가지고 있습니다: ${importPath}`,
          );
        }
      });
    });
  });

  test('✅ View는 Controller에 의존하면 안 되며, Model과 Util은 허용된다', () => {
    viewFiles.forEach((viewFilePath) => {
      const importPaths = getImportPathsFromFile(viewFilePath);
      importPaths.forEach((importPath) => {
        const isControllerDependency = importPath.includes('Controller');
        if (isControllerDependency) {
          throw new Error(
            `[❌] ${viewFilePath} 파일이 Controller를 import하고 있습니다: ${importPath}`,
          );
        }
      });
    });
  });

  test('✅ Controller는 Model, View, Util 모두 의존할 수 있다', () => {
    controllerFiles.forEach((controllerFilePath) => {
      const importPaths = getImportPathsFromFile(controllerFilePath);

      const invalidImports = importPaths.filter(
        (importPath) =>
          importPath.startsWith('.') &&
          !importPath.includes('Model') &&
          !importPath.includes('View') &&
          !importPath.includes('Util'),
      );

      if (invalidImports.length > 0) {
        throw new Error(
          `[❌] ${controllerFilePath} 파일이 허용되지 않은 내부 모듈을 import하고 있습니다: ${invalidImports.join(
            ', ',
          )}`,
        );
      }
    });
  });
});
