export default class WinningResult {
  #matchCounts = {};

  constructor() {
    // 3, 4, 5, 5BONUS, 6 등 로또 등수만 저장
    ['3', '4', '5', '5BONUS', '6'].forEach((key) => (this.#matchCounts[key] = 0));
  }

  recordMatches(lottos, winningNumbers, bonusNumber) {
    lottos.forEach((lotto) => {
      const numbers = lotto.getNumbers();
      const matchCount = numbers.filter((number) => winningNumbers.includes(number)).length;
      const hasBonus = numbers.includes(bonusNumber);

      let key = matchCount.toString();
      if (matchCount === 5 && hasBonus) key = '5BONUS';

      if (this.#matchCounts[key] === undefined) return; // 유효한 등수만 카운트
      this.#matchCounts[key] = (this.#matchCounts[key] ?? 0) + 1;
    });
  }

  getMatchCounts() {
    return structuredClone(this.#matchCounts);
  }

  getMatchCount(key) {
    return this.#matchCounts[key] ?? 0;
  }
}
