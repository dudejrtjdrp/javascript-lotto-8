import InputHandler from '../view/inputHandler.js';
import OutputHandler from '../view/outputHandler.js';
import { INPUT_COMMENT, LOTTO_PRIZE } from '../Util/constants.js';
import Validation from '../Util/validation.js';
import MultipleLotto from '../Model/MultipleLotto.js';
import WinningResult from '../Model/WinningResult.js';

export default class LottoController {
  static async play() {
    try {
      const totalAmountInput = await InputHandler.read(INPUT_COMMENT.FIRST);
      Validation.validateTotalAmount(totalAmountInput);
      const purchaseAmount = Number(totalAmountInput);

      const lottoCount = purchaseAmount / 1000;
      const multipleLotto = new MultipleLotto(lottoCount);

      OutputHandler.print(`\n${lottoCount}개를 구매했습니다.`);
      multipleLotto.getLottos().forEach((lotto) => {
        OutputHandler.print(`[${lotto.getNumbers().join(', ')}]`);
      });

      const winningNumberInput = await InputHandler.read(INPUT_COMMENT.SECOND);
      Validation.validateLottoNumbers(winningNumberInput);
      const winningNumbers = winningNumberInput
        .split(',')
        .map(Number)
        .sort((a, b) => a - b);

      const bonusNumberInput = await InputHandler.read(INPUT_COMMENT.THIRD);
      Validation.validateBonusNumber(bonusNumberInput, winningNumbers);
      const bonusNumber = Number(bonusNumberInput);

      const result = new WinningResult();
      result.recordMatches(multipleLotto.getLottos(), winningNumbers, bonusNumber);

      const totalPrize = this.calculateTotalPrize(result);
      const profitRate = this.calculateProfitRate(totalPrize, purchaseAmount);

      this.printStatistics(result.getMatchCounts(), totalPrize, profitRate);
    } catch (error) {
      OutputHandler.printError(error);
      throw error;
    }
  }

  static calculateTotalPrize(result) {
    const matchCounts = result.getMatchCounts();
    let total = 0;
    for (const [key, count] of Object.entries(matchCounts)) {
      if (LOTTO_PRIZE[key] !== undefined) {
        total += LOTTO_PRIZE[key] * count;
      }
    }
    return total;
  }

  static calculateProfitRate(totalPrize, purchaseAmount) {
    if (!purchaseAmount) return '0.0';
    return ((totalPrize / purchaseAmount) * 100).toFixed(1);
  }

  static printStatistics(matchCounts, totalPrize, profitRate) {
    OutputHandler.print('\n당첨 통계\n---');
    OutputHandler.print(
      `3개 일치 (${LOTTO_PRIZE['3'].toLocaleString()}원) - ${matchCounts['3']}개`,
    );
    OutputHandler.print(
      `4개 일치 (${LOTTO_PRIZE['4'].toLocaleString()}원) - ${matchCounts['4']}개`,
    );
    OutputHandler.print(
      `5개 일치 (${LOTTO_PRIZE['5'].toLocaleString()}원) - ${matchCounts['5']}개`,
    );
    OutputHandler.print(
      `5개 일치, 보너스 볼 일치 (${LOTTO_PRIZE['5BONUS'].toLocaleString()}원) - ${
        matchCounts['5BONUS']
      }개`,
    );
    OutputHandler.print(
      `6개 일치 (${LOTTO_PRIZE['6'].toLocaleString()}원) - ${matchCounts['6']}개`,
    );
    OutputHandler.print(`총 수익률은 ${profitRate}%입니다.`);
  }
}
