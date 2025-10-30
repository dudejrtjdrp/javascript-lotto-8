// __tests__/Model/MultipleLottoTest.js
import MultipleLotto from '../../src/Model/MultipleLotto.js';
import Lotto from '../../src/Model/Lotto.js';
import { MULTIPLE_LOTTO_ERROR } from '../../src/Util/constants.js';

describe('MultipleLotto 클래스 테스트', () => {
  test('count가 0 이하이면 에러 발생', () => {
    expect(() => new MultipleLotto(0)).toThrow(MULTIPLE_LOTTO_ERROR.INVALID_COUNT);
    expect(() => new MultipleLotto(-1)).toThrow(MULTIPLE_LOTTO_ERROR.INVALID_COUNT);
  });

  test('addLotto에 Lotto 인스턴스가 아닌 객체를 넣으면 에러 발생', () => {
    const instance = new MultipleLotto(1); // 정상적으로 1개 생성
    expect(() => instance.addLotto({ numbers: [1, 2, 3, 4, 5, 6] })).toThrow(
      MULTIPLE_LOTTO_ERROR.NOT_LOTTO_INSTANCE,
    );
  });

  test('count만큼 로또가 생성되어야 함', () => {
    const instance = new MultipleLotto(5);
    expect(instance.countTotal()).toBe(5);
    expect(instance.getLottos().every((l) => l instanceof Lotto)).toBe(true);
  });
});
