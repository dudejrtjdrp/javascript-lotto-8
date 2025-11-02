import MatchCount from './MatchCount.js';

export default class MultipleMatchCount {
  #multipleMatchCount;

  constructor() {
    this.#multipleMatchCount = {
      3: new MatchCount(3),
      4: new MatchCount(4),
      5: new MatchCount(5),
      '5BONUS': new MatchCount('5BONUS'),
      6: new MatchCount(6),
    };
  }

  increment(rank) {
    this.#multipleMatchCount[rank]?.increment();
  }

  get(rank) {
    return this.#multipleMatchCount[rank]?.getCount() ?? 0;
  }

  getTotalPrize() {
    return Object.values(this.#multipleMatchCount).reduce(
      (sum, match) => sum + match.getTotalPrize(),
      0,
    );
  }

  getAll() {
    const result = {};
    for (const [rank, match] of Object.entries(this.#multipleMatchCount)) {
      result[rank] = {
        count: match.getCount(),
        prize: match.getPrize(),
        totalPrize: match.getTotalPrize(),
      };
    }
    return result;
  }
}
