import Lotto from '../../src/Model/Lotto.js';
import { LOTTO_ERROR } from '../../src/Util/constants.js';

describe('Lotto 클래스 테스트', () => {
  test('정상적인 로또 번호는 객체 생성이 가능해야 한다', () => {
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
    expect(lotto.getNumbers()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('배열이 아닌 값으로 생성 시 에러가 발생한다', () => {
    expect(() => new Lotto('123456')).toThrow(LOTTO_ERROR.ARRAY);
    expect(() => new Lotto(123456)).toThrow(LOTTO_ERROR.ARRAY);
    expect(() => new Lotto(null)).toThrow(LOTTO_ERROR.ARRAY);
  });

  test('6개가 아닌 개수로 생성 시 에러가 발생한다', () => {
    expect(() => new Lotto([1, 2, 3, 4, 5])).toThrow(LOTTO_ERROR.COUNT_SIX);
    expect(() => new Lotto([1, 2, 3, 4, 5, 6, 7])).toThrow(LOTTO_ERROR.COUNT_SIX);
  });

  test('중복된 번호가 있을 경우 에러가 발생한다', () => {
    expect(() => new Lotto([1, 1, 2, 3, 4, 5])).toThrow(LOTTO_ERROR.REDUNDANT);
    expect(() => new Lotto([1, 2, 3, 4, 5, 5])).toThrow(LOTTO_ERROR.REDUNDANT);
  });

  test('1~45 범위를 벗어난 번호가 있을 경우 에러가 발생한다', () => {
    expect(() => new Lotto([0, 1, 2, 3, 4, 5])).toThrow(LOTTO_ERROR.NUMBER_RANGE);
    expect(() => new Lotto([1, 2, 3, 4, 5, 46])).toThrow(LOTTO_ERROR.NUMBER_RANGE);
    expect(() => new Lotto([-1, 1, 2, 3, 4, 5])).toThrow(LOTTO_ERROR.NUMBER_RANGE);
  });

  test('오름차순으로 정렬되지 않은 경우 에러가 발생한다', () => {
    expect(() => new Lotto([6, 5, 4, 3, 2, 1])).toThrow(LOTTO_ERROR.ASCENDING);
    expect(() => new Lotto([1, 3, 2, 4, 5, 6])).toThrow(LOTTO_ERROR.ASCENDING);
  });

  test('원본 배열이 변경되어도 로또 번호는 변경되지 않는다', () => {
    const numbers = [1, 2, 3, 4, 5, 6];
    const lotto = new Lotto(numbers);
    numbers[0] = 10;
    expect(lotto.getNumbers()[0]).toBe(1);
  });

  test('getNumbers로 받은 배열을 변경해도 원본은 변경되지 않는다', () => {
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
    const numbers = lotto.getNumbers();
    numbers[0] = 10;
    expect(lotto.getNumbers()[0]).toBe(1);
  });

  describe('보너스 번호 확인', () => {
    test('보너스 번호가 로또 번호에 포함되어 있으면 true를 반환한다', () => {
      const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
      expect(lotto.hasBonus(3)).toBe(true);
      expect(lotto.hasBonus(6)).toBe(true);
    });

    test('보너스 번호가 로또 번호에 포함되어 있지 않으면 false를 반환한다', () => {
      const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
      expect(lotto.hasBonus(7)).toBe(false);
      expect(lotto.hasBonus(45)).toBe(false);
    });
  });
});
