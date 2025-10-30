import Lotto from '../../src/Model/Lotto.js';
import { LOTTO_ERROR } from '../../src/Util/constants.js';

describe('Lotto 클래스 테스트', () => {
  test('✅ 정상적인 로또 번호는 객체 생성이 가능해야 한다', () => {
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
    expect(lotto.getNumbers()).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('❌ 6개의 숫자가 아닌 경우 예외 발생', () => {
    expect(() => new Lotto([1, 2, 3, 4, 5])).toThrow(LOTTO_ERROR.COUNT_SIX);
  });

  test('❌ 숫자가 중복된 경우 예외 발생', () => {
    expect(() => new Lotto([1, 1, 2, 3, 4, 5])).toThrow(LOTTO_ERROR.REDUNDANT);
  });

  test('❌ 숫자가 1~45 범위를 벗어나는 경우 예외 발생', () => {
    expect(() => new Lotto([0, 2, 3, 4, 5, 6])).toThrow(LOTTO_ERROR.NUMBER_RANGE);
    expect(() => new Lotto([1, 2, 3, 4, 5, 50])).toThrow(LOTTO_ERROR.NUMBER_RANGE);
  });

  test('❌ numbers가 오름차순으로 정렬되지 않은 경우 예외 발생', () => {
    expect(() => new Lotto([3, 1, 2, 4, 5, 6])).toThrow(LOTTO_ERROR.ASCENDING);
  });

  test('❌ 배열이 아닌 형식 (예: 문자열) 예외 발생', () => {
    expect(() => new Lotto('1,2,3,4,5,6')).toThrow(LOTTO_ERROR.ARRAY);
  });
});
