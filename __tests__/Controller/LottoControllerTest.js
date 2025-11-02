import LottoController from '../../src/Controller/LottoController.js';
import Lotto from '../../src/Model/Lotto.js';
import MultipleLotto from '../../src/Model/MultipleLotto.js';
import WinningResult from '../../src/Model/WinningResult.js';
import { LOTTO_PRIZE } from '../../src/Util/constants.js';
import Validation from '../../src/Util/validation.js';

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

describe('LottoController 테스트', () => {
  describe('총 상금 계산', () => {
    test('5등 1개 당첨 시 5,000원', () => {
      const result = new WinningResult();
      result.recordMatches([new Lotto([1, 2, 3, 10, 11, 12])], [1, 2, 3, 4, 5, 6], 7);

      const totalPrize = LottoController.calculateTotalPrize(result);
      expect(totalPrize).toBe(5000);

      const purchaseAmount = 8000;
      const profitRate = LottoController.calculateProfitRate(totalPrize, purchaseAmount);
      expect(parseFloat(profitRate)).toBeGreaterThan(0);
    });

    test('모든 로또가 꽝일 때도 정상 동작한다', () => {
      const lottos = [
        new Lotto([10, 11, 12, 13, 14, 15]),
        new Lotto([20, 21, 22, 23, 24, 25]),
        new Lotto([30, 31, 32, 33, 34, 35]),
      ];

      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const bonusNumber = 7;

      const result = new WinningResult();
      result.recordMatches(lottos, winningNumbers, bonusNumber);

      expect(result.getMatchCount('6')).toBe(0);
      expect(result.getMatchCount('5BONUS')).toBe(0);
      expect(result.getMatchCount('5')).toBe(0);
      expect(result.getMatchCount('4')).toBe(0);
      expect(result.getMatchCount('3')).toBe(0);

      const totalPrize = LottoController.calculateTotalPrize(result);
      expect(totalPrize).toBe(0);

      const profitRate = LottoController.calculateProfitRate(totalPrize, 3000);
      expect(profitRate).toBe('0.0');
    });

    test('1등만 당첨되어도 정상 동작한다', () => {
      const lottos = [new Lotto([1, 2, 3, 4, 5, 6])];

      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const bonusNumber = 7;

      const result = new WinningResult();
      result.recordMatches(lottos, winningNumbers, bonusNumber);

      expect(result.getMatchCount('6')).toBe(1);

      const totalPrize = LottoController.calculateTotalPrize(result);
      expect(totalPrize).toBe(LOTTO_PRIZE['6']);

      const profitRate = LottoController.calculateProfitRate(totalPrize, 1000);
      expect(profitRate).toBe('200000000.0');
    });

    test('대량의 로또를 처리할 수 있다', () => {
      const lottos = [];
      for (let i = 0; i < 100; i++) {
        lottos.push(new Lotto([10, 11, 12, 13, 14, 15]));
      }

      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const bonusNumber = 7;

      const result = new WinningResult();
      expect(() => result.recordMatches(lottos, winningNumbers, bonusNumber)).not.toThrow();

      const totalPrize = LottoController.calculateTotalPrize(result);
      expect(totalPrize).toBe(0);
    });

    test('1등 복권 10장 당첨 시 총 상금 계산', () => {
      const lottos = Array.from({ length: 10 }, () => new Lotto([1, 2, 3, 4, 5, 6]));

      const winningNumbers = [1, 2, 3, 4, 5, 6];
      const bonusNumber = 7;

      const result = new WinningResult();
      expect(() => result.recordMatches(lottos, winningNumbers, bonusNumber)).not.toThrow();

      expect(result.getMatchCount('6')).toBe(10);

      const totalPrize = LottoController.calculateTotalPrize(result);
      expect(totalPrize).toBe(LOTTO_PRIZE['6'] * 10);

      const purchaseAmount = 10000;
      const profitRate = LottoController.calculateProfitRate(totalPrize, purchaseAmount);
      expect(profitRate).toBe((((LOTTO_PRIZE['6'] * 10) / purchaseAmount) * 100).toFixed(1));
    });
  });

  describe('경계값 테스트', () => {
    test('최소값 1을 포함한 로또 번호', () => {
      expect(() => new Lotto([1, 2, 3, 4, 5, 6])).not.toThrow();
    });

    test('최대값 45를 포함한 로또 번호', () => {
      expect(() => new Lotto([40, 41, 42, 43, 44, 45])).not.toThrow();
    });

    test('1부터 6까지 연속된 번호', () => {
      const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
      expect(lotto.getNumbers()).toEqual([1, 2, 3, 4, 5, 6]);
    });

    test('40부터 45까지 연속된 번호', () => {
      const lotto = new Lotto([40, 41, 42, 43, 44, 45]);
      expect(lotto.getNumbers()).toEqual([40, 41, 42, 43, 44, 45]);
    });

    test('최소 구매 금액 1000원', () => {
      expect(() => Validation.validateTotalAmount('1000')).not.toThrow();
    });

    test('999원은 에러 발생', () => {
      expect(() => Validation.validateTotalAmount('999')).toThrow();
    });
  });

  describe('보너스 번호 특수 케이스', () => {
    test('5개 일치했지만 보너스 번호가 당첨 번호에 포함되어 있지 않으면 3등', () => {
      const result = new WinningResult();
      const lottos = [new Lotto([1, 2, 3, 4, 5, 10])];
      result.recordMatches(lottos, [1, 2, 3, 4, 5, 6], 7);

      expect(result.getMatchCount('5')).toBe(1);
      expect(result.getMatchCount('5BONUS')).toBe(0);
    });

    test('5개 일치하고 나머지 1개가 보너스 번호면 2등', () => {
      const result = new WinningResult();
      const lottos = [new Lotto([1, 2, 3, 4, 5, 7])];
      result.recordMatches(lottos, [1, 2, 3, 4, 5, 6], 7);

      expect(result.getMatchCount('5BONUS')).toBe(1);
      expect(result.getMatchCount('5')).toBe(0);
    });

    test('4개 이하 일치 시 보너스 번호는 무시된다', () => {
      const result = new WinningResult();
      const lottos = [new Lotto([1, 2, 3, 4, 7, 10])];
      result.recordMatches(lottos, [1, 2, 3, 4, 5, 6], 7);

      expect(result.getMatchCount('4')).toBe(1);
      expect(result.getMatchCount('5BONUS')).toBe(0);
    });
  });

  describe('숫자 형변환 테스트', () => {
    test('문자열 숫자는 숫자로 변환되어 처리된다', () => {
      expect(() => Validation.validateTotalAmount('5000')).not.toThrow();
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,6')).not.toThrow();
      expect(() => Validation.validateBonusNumber('7', [1, 2, 3, 4, 5, 6])).not.toThrow();
    });

    test('공백이 포함된 문자열도 처리된다', () => {
      expect(() => Validation.validateLottoNumbers('1, 2, 3, 4, 5, 6')).not.toThrow();
    });

    test('앞뒤 공백은 무시된다', () => {
      expect(() => Validation.validateTotalAmount(' 5000 ')).not.toThrow();
    });
  });

  describe('동일 번호 순서 테스트', () => {
    test('당첨 번호와 로또 번호의 순서가 달라도 일치 확인 가능', () => {
      const result = new WinningResult();

      const multipleLotto = new MultipleLotto(1);

      jest
        .spyOn(multipleLotto, 'getLottos')
        .mockReturnValue([{ getNumbers: () => [6, 5, 4, 3, 2, 1] }]);

      result.recordMatches(multipleLotto.getLottos(), [1, 2, 3, 4, 5, 6], 7);

      expect(result.getMatchCount('6')).toBe(1);
    });
  });

  describe('불변성 테스트', () => {
    test('Lotto 객체 생성 후 원본 배열 수정해도 영향 없음', () => {
      const numbers = [1, 2, 3, 4, 5, 6];
      const lotto = new Lotto(numbers);
      numbers[0] = 100;

      expect(lotto.getNumbers()[0]).toBe(1);
    });

    test('getNumbers로 받은 배열 수정해도 원본 영향 없음', () => {
      const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
      const numbers = lotto.getNumbers();
      numbers[0] = 100;

      expect(lotto.getNumbers()[0]).toBe(1);
    });

    test('WinningResult의 matchCounts 수정해도 원본 영향 없음', () => {
      const result = new WinningResult();
      const counts = result.getMatchCounts();
      counts['3'] = 999;

      expect(result.getMatchCount('3')).toBe(0);
    });

    test('MultipleLotto의 lottos 배열 수정해도 원본 영향 없음', () => {
      const multipleLotto = new MultipleLotto(2);
      const lottos = multipleLotto.getLottos();
      lottos.pop();

      expect(multipleLotto.countTotal()).toBe(2);
    });
  });
});
