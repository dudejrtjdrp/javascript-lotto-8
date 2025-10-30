import LottoController from '../../src/Controller/LottoController.js';
import MultipleLotto from '../../src/Model/MultipleLotto.js';
import WinningResult from '../../src/Model/WinningResult.js';
import { InputHandler, OutputHandler } from '../../src/view/inputHandler.js';
import { LOTTO_PRIZE } from '../../src/Util/constants.js';

jest.mock('../../src/view/inputHandler.js');
jest.mock('../../src/Model/MultipleLotto.js');
jest.mock('../../src/Model/WinningResult.js');

describe('LottoController 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('play 메소드 정상 흐름 테스트', async () => {
    InputHandler.read
      .mockResolvedValueOnce('5000') // 구매금액
      .mockResolvedValueOnce('1,2,3,4,5,6') // 당첨 번호
      .mockResolvedValueOnce('7'); // 보너스 번호

    const mockLottos = [{ getNumbers: () => [1, 2, 3, 4, 5, 6] }];
    MultipleLotto.prototype.getLottos.mockReturnValue(mockLottos);

    const mockResultInstance = {
      recordMatches: jest.fn(),
      getMatchCounts: jest.fn().mockReturnValue({
        3: 0,
        4: 0,
        5: 0,
        '5BONUS': 0,
        6: 1,
      }),
    };
    WinningResult.mockImplementation(() => mockResultInstance);

    OutputHandler.print = jest.fn();

    await LottoController.play();

    // MultipleLotto 생성 확인
    expect(MultipleLotto).toHaveBeenCalledWith(5);

    // WinningResult 호출 및 recordMatches 확인
    expect(WinningResult).toHaveBeenCalled();
    expect(mockResultInstance.recordMatches).toHaveBeenCalledWith(
      mockLottos,
      [1, 2, 3, 4, 5, 6],
      7,
    );

    // 출력 확인
    expect(OutputHandler.print).toHaveBeenCalledWith('당첨 통계\n---');
    expect(OutputHandler.print).toHaveBeenCalledWith(
      `6개 일치 (${LOTTO_PRIZE['6'].toLocaleString()}원) - 1개`,
    );
  });

  test('play 메소드 입력 에러 시 OutputHandler.printError 호출', async () => {
    const error = new Error('잘못된 입력');
    InputHandler.read.mockRejectedValue(error);
    OutputHandler.printError = jest.fn();

    await expect(LottoController.play()).rejects.toThrow(error);
    expect(OutputHandler.printError).toHaveBeenCalledWith(error);
  });
});
