export default class WinningResult {
  #matchCounts = {};

  constructor() {
    // 3, 4, 5, 5B, 6 등 로또 등수만 저장
    ['3', '4', '5', '5BONUS', '6'].forEach((key) => (this.#matchCounts[key] = 0));
  }

  recordMatches(lottos, winningNumbers, bonusNumber) {
    lottos.forEach((lotto) => {
      const numbers = lotto.getNumbers();
      const matchCount = numbers.filter((n) => winningNumbers.includes(n)).length;
      const hasBonus = numbers.includes(bonusNumber);

      let key = matchCount.toString();
      if (matchCount === 5 && hasBonus) key = '5BONUS';

      this.#matchCounts[key] += 1;
    });
  }

  getMatchCounts() {
    return { ...this.#matchCounts };
  }

  getMatchCount(key) {
    return this.#matchCounts[key] ?? 0;
  }
}
