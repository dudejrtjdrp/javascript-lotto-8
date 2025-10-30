import MultipleLotto from '../../src/Model/MultipleLotto.js';
import { LOTTO_ERROR, MULTIPLE_LOTTO_ERROR } from '../../src/Util/constants.js';

describe('MultipleLotto 클래스 테스트', () => {
  let multipleLotto;

  beforeEach(() => {
    multipleLotto = new MultipleLotto();
  });

  test('generateRandomLottos에 음수를 전달하면 에러 발생', () => {
    expect(() => multipleLotto.generateRandomLottos(-1)).toThrow(
      MULTIPLE_LOTTO_ERROR.INVALID_COUNT,
    );
  });

  test('랜덤 생성 함수가 6개 숫자를 반환하지 않을 때 Lotto에서 에러 발생', () => {
    const badGenerator = () => [1, 2, 3]; // 6개 아님
    expect(() => multipleLotto.generateRandomLottos(1, badGenerator)).toThrow(
      LOTTO_ERROR.COUNT_SIX,
    );
  });

  test('랜덤 생성 함수가 중복 숫자를 포함할 때 Lotto에서 에러 발생', () => {
    const badGenerator = () => [1, 1, 2, 3, 4, 5];
    expect(() => multipleLotto.generateRandomLottos(1, badGenerator)).toThrow(
      LOTTO_ERROR.REDUNDANT,
    );
  });

  test('랜덤 생성 함수가 범위를 벗어난 숫자를 포함할 때 Lotto에서 에러 발생', () => {
    const badGenerator = () => [0, 2, 3, 4, 5, 6];
    expect(() => multipleLotto.generateRandomLottos(1, badGenerator)).toThrow(
      LOTTO_ERROR.NUMBER_RANGE,
    );
  });

  test('랜덤 생성 함수가 오름차순이 아닌 숫자를 포함할 때 Lotto에서 에러 발생', () => {
    const badGenerator = () => [2, 1, 3, 4, 5, 6];
    expect(() => multipleLotto.generateRandomLottos(1, badGenerator)).toThrow(
      LOTTO_ERROR.ASCENDING,
    );
  });

  test('addLotto에 Lotto 인스턴스가 아닌 객체를 넣으면 에러 발생', () => {
    expect(() => multipleLotto.addLotto({ numbers: [1, 2, 3, 4, 5, 6] })).toThrow(
      MULTIPLE_LOTTO_ERROR.NOT_LOTTO_INSTANCE,
    );
  });
});
