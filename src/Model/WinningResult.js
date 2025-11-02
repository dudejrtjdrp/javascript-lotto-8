import MultipleMatchCount from './MultipleMatchCount.js';

export default class WinningResult {
  #matchCounts;

  constructor() {
    this.#matchCounts = new MultipleMatchCount();
  }

  recordMatches(lottos, winningNumbers, bonusNumber) {
    const matchResults = this.#calculateMatches(lottos, winningNumbers, bonusNumber);

    matchResults.forEach((key) => {
      this.#matchCounts.increment(key);
    });
  }

  #calculateMatches(lottos, winningNumbers, bonusNumber) {
    return lottos
      .map((lotto) => {
        const numbers = lotto.getNumbers();
        const matchCount = numbers.filter((num) => winningNumbers.includes(num)).length;
        const hasBonus = numbers.includes(bonusNumber);

        if (matchCount === 5 && hasBonus) return '5BONUS';
        if (matchCount >= 3) return matchCount.toString();
        return null;
      })
      .filter((rank) => rank !== null);
  }

  getMatchCounts() {
    return this.#matchCounts.getAll();
  }

  getMatchCount(key) {
    return this.#matchCounts.get(key);
  }
}
