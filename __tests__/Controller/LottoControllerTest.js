import LottoController from '../../src/Controller/LottoController.js';
import InputHandler from '../../src/view/inputHandler.js';
import OutputHandler from '../../src/view/outputHandler.js';
import MultipleLotto from '../../src/Model/MultipleLotto.js';
import WinningResult from '../../src/Model/WinningResult.js';

jest.mock('../../src/view/inputHandler.js', () => ({
  __esModule: true,
  default: {
    read: jest.fn(),
  },
}));

jest.mock('../../src/view/outputHandler.js', () => ({
  __esModule: true,
  default: {
    print: jest.fn(),
    printError: jest.fn(),
  },
}));
jest.mock('../../src/Model/MultipleLotto.js');
jest.mock('../../src/Model/WinningResult.js');

describe('LottoController 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('play 메소드 정상 흐름 테스트', async () => {
    InputHandler.read
      .mockResolvedValueOnce('5000') // 총 금액
      .mockResolvedValueOnce('1,2,3,4,5,6') // 당첨 번호
      .mockResolvedValueOnce('7'); // 보너스 번호

    const mockGetLottos = jest.fn().mockReturnValue([{ getNumbers: () => [1, 2, 3, 4, 5, 6] }]);
    MultipleLotto.mockImplementation(() => ({
      getLottos: mockGetLottos,
    }));

    const mockRecordMatches = jest.fn();
    WinningResult.mockImplementation(() => ({
      recordMatches: mockRecordMatches,
      getMatchCounts: jest.fn().mockReturnValue({ 3: 1, 4: 0, 5: 0, '5BONUS': 0, 6: 0 }),
    }));

    await LottoController.play();

    // 입력값 읽기 호출 확인
    expect(InputHandler.read).toHaveBeenCalledTimes(3);
    // 당첨 결과 기록 호출 확인
    expect(mockRecordMatches).toHaveBeenCalled();
    // OutputHandler.print 호출 확인
    expect(OutputHandler.print).toHaveBeenCalled();
  });

  test('play 메소드 입력 에러 시 OutputHandler.printError 호출', async () => {
    const error = new Error('잘못된 입력');
    InputHandler.read.mockRejectedValue(error);

    await expect(LottoController.play()).rejects.toThrow(error);
    expect(OutputHandler.printError).toHaveBeenCalledWith(error);
  });
});
