import LottoController from '../../src/Controller/LottoController.js';
import MultipleLotto from '../../src/Model/MultipleLotto.js';
import Lotto from '../../src/Model/Lotto.js';
import WinningResult from '../../src/Model/WinningResult.js';
import MultipleMatchCount from '../../src/Model/MultipleMatchCount.js';
import MatchCount from '../../src/Model/MatchCount.js';
import { LOTTO_PRIZE, MULTIPLE_LOTTO_ERROR } from '../../src/Util/constants.js';
import { Random } from '@woowacourse/mission-utils';

jest.mock('@woowacourse/mission-utils', () => ({
  Random: {
    pickUniqueNumbersInRange: jest.fn(),
  },
}));

describe('MultipleLotto 클래스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Random.pickUniqueNumbersInRange.mockReturnValue([1, 2, 3, 4, 5, 6]);
  });

  describe('로또 여러 장 생성', () => {
    test('지정한 개수만큼 로또가 생성되어야 한다', () => {
      const multipleLotto = new MultipleLotto(5);
      expect(multipleLotto.countTotal()).toBe(5);
      expect(multipleLotto.getLottos().length).toBe(5);
    });

    test('1장의 로또를 생성할 수 있다', () => {
      const multipleLotto = new MultipleLotto(1);
      expect(multipleLotto.countTotal()).toBe(1);
    });

    test('개수가 정수가 아닌 경우 에러가 발생한다', () => {
      expect(() => new MultipleLotto(1.5)).toThrow(MULTIPLE_LOTTO_ERROR.INVALID_COUNT);
      expect(() => new MultipleLotto('abc')).toThrow(MULTIPLE_LOTTO_ERROR.INVALID_COUNT);
    });

    test('개수가 1보다 작은 경우 에러가 발생한다', () => {
      expect(() => new MultipleLotto(0)).toThrow(MULTIPLE_LOTTO_ERROR.INVALID_COUNT);
      expect(() => new MultipleLotto(-1)).toThrow(MULTIPLE_LOTTO_ERROR.INVALID_COUNT);
    });

    test('생성된 로또들은 모두 Lotto 인스턴스여야 한다', () => {
      const multipleLotto = new MultipleLotto(3);
      multipleLotto.getLottos().forEach((lotto) => {
        expect(lotto).toBeInstanceOf(Lotto);
      });
    });

    test('각 로또는 랜덤으로 생성된 번호를 가져야 한다', () => {
      Random.pickUniqueNumbersInRange
        .mockReturnValueOnce([1, 2, 3, 4, 5, 6])
        .mockReturnValueOnce([7, 8, 9, 10, 11, 12]);

      const multipleLotto = new MultipleLotto(2);
      const lottos = multipleLotto.getLottos();

      expect(lottos[0].getNumbers()).toEqual([1, 2, 3, 4, 5, 6]);
      expect(lottos[1].getNumbers()).toEqual([7, 8, 9, 10, 11, 12]);
    });
  });

  describe('로또 추가', () => {
    test('Lotto 인스턴스를 추가할 수 있다', () => {
      const multipleLotto = new MultipleLotto(1);
      const lotto = new Lotto([7, 8, 9, 10, 11, 12]);
      multipleLotto.addLotto(lotto);
      expect(multipleLotto.countTotal()).toBe(2);
    });

    test('Lotto 인스턴스가 아닌 값을 추가하면 에러가 발생한다', () => {
      const multipleLotto = new MultipleLotto(1);
      expect(() => multipleLotto.addLotto([1, 2, 3, 4, 5, 6])).toThrow(
        MULTIPLE_LOTTO_ERROR.NOT_LOTTO_INSTANCE,
      );
      expect(() => multipleLotto.addLotto('lotto')).toThrow(
        MULTIPLE_LOTTO_ERROR.NOT_LOTTO_INSTANCE,
      );
    });
  });

  describe('로또 조회', () => {
    test('getLottos로 받은 배열을 수정해도 원본은 변경되지 않는다', () => {
      const multipleLotto = new MultipleLotto(2);
      const lottos = multipleLotto.getLottos();
      lottos.pop();
      expect(multipleLotto.countTotal()).toBe(2);
    });
  });
});

describe('WinningResult & MultipleMatchCount 테스트', () => {
  test('WinningResult가 로또 결과를 기록하고 통계를 반환해야 한다', () => {
    const result = new WinningResult();
    const lotto1 = new Lotto([1, 2, 3, 4, 5, 6]); // 6개 일치
    const lotto2 = new Lotto([1, 2, 3, 4, 5, 7]); // 5개+보너스
    const bonusNumber = 7;
    const winningNumbers = [1, 2, 3, 4, 5, 6];

    result.recordMatches([lotto1, lotto2], winningNumbers, bonusNumber);

    const counts = result.getMatchCounts();
    expect(counts[6].count).toBe(1);
    expect(counts['5BONUS'].count).toBe(1);
    expect(counts[3].count).toBe(0);
  });

  test('MultipleMatchCount getAll() 구조가 올바르게 반환되어야 한다', () => {
    const result = new WinningResult();
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches([lotto], winningNumbers, bonusNumber);
    const all = result.getMatchCounts();

    expect(all[6]).toEqual({
      count: 1,
      prize: LOTTO_PRIZE[6],
      totalPrize: LOTTO_PRIZE[6],
    });
    expect(all['5BONUS']).toEqual({
      count: 0,
      prize: LOTTO_PRIZE['5BONUS'],
      totalPrize: 0,
    });
  });
});
