// src/Model/MultipleLotto.js
import Lotto from './Lotto.js';
import { MULTIPLE_LOTTO_ERROR } from '../Util/constants.js';
import { Random } from '@woowacourse/mission-utils';

export default class MultipleLotto {
  #lottos = [];

  constructor(count) {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error(MULTIPLE_LOTTO_ERROR.INVALID_COUNT);
    }

    for (let i = 0; i < count; i += 1) {
      const numbers = this.#generateRandomNumbers();
      this.addLotto(new Lotto(numbers));
    }

    if (this.countTotal() !== count) {
      throw new Error(MULTIPLE_LOTTO_ERROR.COUNT_MISMATCH);
    }
  }

  addLotto(lotto) {
    if (!(lotto instanceof Lotto)) {
      throw new Error(MULTIPLE_LOTTO_ERROR.NOT_LOTTO_INSTANCE);
    }
    this.#lottos.push(lotto);
  }

  getLottos() {
    return [...this.#lottos];
  }

  countTotal() {
    return this.#lottos.length;
  }

  #generateRandomNumbers() {
    return Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b);
  }
}
