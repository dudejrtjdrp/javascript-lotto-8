import MultipleLotto from '../../src/Model/MultipleLotto.js';
import Lotto from '../../src/Model/Lotto.js';
import { MULTIPLE_LOTTO_ERROR } from '../../src/Util/constants.js';
import { Random } from '@woowacourse/mission-utils';

// Random 모킹
jest.mock('@woowacourse/mission-utils', () => ({
  Random: {
    pickUniqueNumbersInRange: jest.fn(),
  },
}));

describe('MultipleLotto 클래스 테스트', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // 기본 모킹 설정
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
