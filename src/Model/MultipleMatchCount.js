import MatchCount from './MatchCount.js';
import { MULTIPLE_MATCH_COUNT_ERROR } from '../Util/constants.js';

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
    // if (!this.#multipleMatchCount[rank]) {
    //   throw new Error(MULTIPLE_MATCH_COUNT_ERROR.INVALID_RANK(rank));
    // }
    this.#multipleMatchCount[String(rank)].increment();
  }

  get(rank) {
    // if (typeof rank !== 'string') {
    //   throw new Error(MULTIPLE_MATCH_COUNT_ERROR.RANK_STRING(rank));
    // }
    const matchCount = this.#multipleMatchCount[String(rank)];
    if (!matchCount) {
      return 0;
    }
    return matchCount.getCount();
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
