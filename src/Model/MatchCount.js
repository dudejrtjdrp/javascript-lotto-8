import { LOTTO_PRIZE } from '../Util/constants';

export default class MatchCount {
  #rank;
  #count;
  #prize;

  constructor(rank) {
    this.#rank = rank;
    this.#count = 0;
    this.#prize = LOTTO_PRIZE[rank];
  }

  increment() {
    this.#count += 1;
  }

  getCount() {
    return this.#count;
  }
  getRank() {
    return this.#rank;
  }
  getPrize() {
    return this.#prize;
  }
  getTotalPrize() {
    return this.#count * this.#prize;
  }
}
