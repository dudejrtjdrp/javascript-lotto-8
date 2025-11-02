import InputHandler from '../View/inputHandler.js';
import OutputHandler from '../View/outputHandler.js';
import { INPUT_COMMENT, LOTTO_PRIZE, PRINT_OUPUT_TEMPLATE } from '../Util/constants.js';
import Validation from '../Util/validation.js';
import MultipleLotto from '../Model/MultipleLotto.js';
import WinningResult from '../Model/WinningResult.js';

export default class LottoController {
  static async play() {
    try {
      const totalAmount = await this.getTotalAmount();
      const multipleLotto = this.buyLottos(totalAmount);

      const winningNumbers = await this.getWinningNumbers();
      const bonusNumber = await this.getBonusNumber(winningNumbers);

      const result = this.calculateLottoResult(multipleLotto, winningNumbers, bonusNumber);
      const totalPrize = this.calculateTotalPrize(result);
      const profitRate = this.calculateProfitRate(totalPrize, totalAmount);

      OutputHandler.printStatistics({
        matchCounts: result.getMatchCounts(),
        profitRate,
      });
    } catch (error) {
      OutputHandler.printError(error);
      throw error;
    }
  }

  static async getTotalAmount() {
    while (true) {
      try {
        const totalAmountInput = await InputHandler.read(INPUT_COMMENT.FIRST);
        Validation.validateTotalAmount(totalAmountInput);
        return Number(totalAmountInput);
      } catch (error) {
        OutputHandler.printError(error);
      }
    }
  }

  static buyLottos(totalAmount) {
    const lottoAmount = totalAmount / 1000;
    const multipleLotto = new MultipleLotto(lottoAmount);

    const lottoCount = multipleLotto.countTotal();
    const lottoNumbersList = multipleLotto.getLottos().map((lotto) => lotto.getNumbers());

    OutputHandler.printPurchasedLottos(lottoCount, lottoNumbersList);

    return multipleLotto;
  }

  static async getWinningNumbers() {
    while (true) {
      try {
        const winningNumberInput = await InputHandler.read(INPUT_COMMENT.SECOND);
        Validation.validateLottoNumbers(winningNumberInput);
        return winningNumberInput
          .split(',')
          .map((num) => Number(num.trim()))
          .sort((a, b) => a - b);
      } catch (error) {
        OutputHandler.printError(error);
      }
    }
  }

  static async getBonusNumber(winningNumbers) {
    while (true) {
      try {
        const bonusNumberInput = await InputHandler.read(INPUT_COMMENT.THIRD);
        Validation.validateBonusNumber(bonusNumberInput, winningNumbers);
        return Number(bonusNumberInput);
      } catch (error) {
        OutputHandler.printError(error);
      }
    }
  }

  static calculateLottoResult(multipleLotto, winningNumbers, bonusNumber) {
    const result = new WinningResult();
    result.recordMatches(multipleLotto.getLottos(), winningNumbers, bonusNumber);
    return result;
  }

  static calculateTotalPrize(result) {
    const matchCounts = result.getMatchCounts();
    let total = 0;

    for (const match of Object.values(matchCounts)) {
      total += match.totalPrize;
    }

    return total;
  }

  static calculateProfitRate(totalPrize, totalAmount) {
    if (!totalAmount) return '0.0';
    const rawRate = (totalPrize / totalAmount) * 100;
    const roundedRate = Math.round((rawRate + Number.EPSILON) * 10) / 10;
    return roundedRate.toFixed(1);
  }
}
