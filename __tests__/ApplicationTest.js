import App from '../src/App.js';
import { MissionUtils } from '@woowacourse/mission-utils';

const mockQuestions = (inputs) => {
  MissionUtils.Console.readLineAsync = jest.fn();
  MissionUtils.Console.readLineAsync.mockImplementation(() => {
    const input = inputs.shift();
    return Promise.resolve(input);
  });
};

const mockRandoms = (numbersList) => {
  MissionUtils.Random.pickUniqueNumbersInRange = jest.fn();
  numbersList.forEach((numbers) => {
    MissionUtils.Random.pickUniqueNumbersInRange.mockReturnValueOnce(numbers);
  });
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

const runException = async (input) => {
  // given
  const logSpy = getLogSpy();

  const RANDOM_NUMBERS_TO_END = [1, 2, 3, 4, 5, 6];
  const INPUT_NUMBERS_TO_END = ['1000', '1,2,3,4,5,6', '7'];

  mockRandoms([RANDOM_NUMBERS_TO_END]);
  mockQuestions([input, ...INPUT_NUMBERS_TO_END]);

  // when
  const app = new App();
  await app.run();

  // then
  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
};

const runWithExceptionInput = async (firstInput, restInputs, randomNumbers) => {
  const logSpy = getLogSpy();

  mockRandoms(randomNumbers);
  mockQuestions([firstInput, ...restInputs]);

  const app = new App();
  await app.run();

  return logSpy;
};

describe('로또 통합 테스트 (재입력 포함)', () => {
  beforeEach(() => jest.restoreAllMocks());

  test('금액 형식 예외', async () => {
    const logSpy = await runWithExceptionInput(
      '1000j',
      ['8000', '1,2,3,4,5,6', '7'],
      [
        [1, 2, 3, 4, 5, 6], // 첫번째 로또
        [7, 8, 9, 10, 11, 12], // 두번째 로또
        [13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30],
        [31, 32, 33, 34, 35, 36],
        [37, 38, 39, 40, 41, 42],
        [43, 44, 45, 1, 2, 3],
      ],
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('8개를 구매했습니다.'));
  });

  test('금액 0원 예외', async () => {
    const logSpy = await runWithExceptionInput(
      '0',
      ['5000', '1,2,3,4,5,6', '7'],
      [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18],
        [19, 20, 21, 22, 23, 24],
        [25, 26, 27, 28, 29, 30],
      ],
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('5개를 구매했습니다.'));
  });

  test('금액 1,000원 단위 예외', async () => {
    const logSpy = await runWithExceptionInput(
      '2500',
      ['3000', '1,2,3,4,5,6', '7'],
      [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
        [13, 14, 15, 16, 17, 18],
      ],
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('3개를 구매했습니다.'));
  });

  test('당첨 번호 6개 미만 예외', async () => {
    const logSpy = await runWithExceptionInput(
      '1000',
      ['1,2,3,4,5', '1,2,3,4,5,6', '7'],
      [[1, 2, 3, 4, 5, 6]],
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
  });

  test('보너스 번호 중복', async () => {
    const logSpy = await runWithExceptionInput(
      '1000',
      ['1,2,3,4,5,6', '6', '7'],
      [[1, 2, 3, 4, 5, 6]],
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('[ERROR]'));
  });

  test('정상 입력 시 구매와 당첨 통계 출력', async () => {
    const logSpy = await runWithExceptionInput(
      '2000',
      ['1,2,3,4,5,6', '7'],
      [
        [1, 2, 3, 4, 5, 6],
        [7, 8, 9, 10, 11, 12],
      ],
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('2개를 구매했습니다.'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('총 수익률'));
  });
});

describe('로또 테스트', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('기능 테스트', async () => {
    // given
    const logSpy = getLogSpy();

    mockRandoms([
      [8, 21, 23, 41, 42, 43],
      [3, 5, 11, 16, 32, 38],
      [7, 11, 16, 35, 36, 44],
      [1, 8, 11, 31, 41, 42],
      [13, 14, 16, 38, 42, 45],
      [7, 11, 30, 40, 42, 43],
      [2, 13, 22, 32, 38, 45],
      [1, 3, 5, 14, 22, 45],
    ]);
    mockQuestions(['8000', '1,2,3,4,5,6', '7']);

    // when
    const app = new App();
    await app.run();

    // then
    const logs = [
      '8개를 구매했습니다.',
      '[8, 21, 23, 41, 42, 43]',
      '[3, 5, 11, 16, 32, 38]',
      '[7, 11, 16, 35, 36, 44]',
      '[1, 8, 11, 31, 41, 42]',
      '[13, 14, 16, 38, 42, 45]',
      '[7, 11, 30, 40, 42, 43]',
      '[2, 13, 22, 32, 38, 45]',
      '[1, 3, 5, 14, 22, 45]',
      '3개 일치 (5,000원) - 1개',
      '4개 일치 (50,000원) - 0개',
      '5개 일치 (1,500,000원) - 0개',
      '5개 일치, 보너스 볼 일치 (30,000,000원) - 0개',
      '6개 일치 (2,000,000,000원) - 0개',
      '총 수익률은 62.5%입니다.',
    ];

    logs.forEach((log) => {
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(log));
    });
  });

  test('예외 테스트', async () => {
    await runException('1000, 1,2,3,4,5,82', '8');
  });

  test('예외 테스트', async () => {
    await runException('1000, 1,2,3,4,5,6,', '82');
  });

  test('예외 테스트', async () => {
    await runException('1000j');
  });
});
