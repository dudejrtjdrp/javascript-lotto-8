import { LOTTO_ERROR } from '../Util/constants';

class Lotto {
  #numbers;

  constructor(numbers) {
    this.#validate(numbers);
    this.#numbers = [...numbers];
  }

  #validate(numbers) {
    this.#validateArray(numbers);
    this.#validateLength(numbers);
    this.#validateRedundant(numbers);
    this.#validateRange(numbers);
    this.#validateSorted(numbers);
  }

  #validateArray(numbers) {
    if (!Array.isArray(numbers)) throw new Error(LOTTO_ERROR.ARRAY);
  }

  #validateLength(numbers) {
    if (numbers.length !== 6) throw new Error(LOTTO_ERROR.COUNT_SIX);
  }

  #validateRedundant(numbers) {
    if (new Set(numbers).size !== numbers.length) throw new Error(LOTTO_ERROR.REDUNDANT);
  }

  #validateRange(numbers) {
    if (numbers.some((n) => n < 1 || n > 45)) throw new Error(LOTTO_ERROR.NUMBER_RANGE);
  }

  #validateSorted(numbers) {
    if (!numbers.every((n, i, arr) => i === 0 || arr[i - 1] <= n)) {
      throw new Error(LOTTO_ERROR.ASCENDING);
    }
  }
  getNumbers() {
    return this.#numbers.slice(); // slice()로 복사본 반환
  }
}

export default Lotto;
