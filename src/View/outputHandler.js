import { Console } from '@woowacourse/mission-utils';
import { ERROR_PREFIX, PRINT_OUPUT_TEMPLATE, LOTTO_PRIZE } from '../Util/constants.js';

class OutputHandler {
  static print(result) {
    Console.print(result);
  }

  static printError(error) {
    if (!error) {
      this.print(ERROR_PREFIX);
      return;
    }
    const handleError = error;
    if (typeof handleError === 'string') {
      if (!handleError.startsWith(ERROR_PREFIX)) {
        this.print(`${ERROR_PREFIX}${handleError}`);
        return;
      }
      this.print(handleError);
      return;
    }

    if (!handleError.message.startsWith(ERROR_PREFIX)) {
      handleError.message = `${ERROR_PREFIX}${handleError.message}`;
    }

    this.print(`${handleError.message}`);
  }

  static printStatistics({ matchCounts, profitRate }) {
    this.print(PRINT_OUPUT_TEMPLATE.HEADER);

    const matchKeys = [3, 4, 5, '5BONUS', 6];
    matchKeys.forEach((key) => {
      this.#printMatchResult(key, matchCounts[key].count);
    });

    this.print(PRINT_OUPUT_TEMPLATE.PROFIT(profitRate));
  }

  static #printMatchResult(key, count) {
    if (key === '5BONUS') {
      this.print(PRINT_OUPUT_TEMPLATE.MATCH_BONUS(LOTTO_PRIZE[key], count));
      return;
    }
    this.print(PRINT_OUPUT_TEMPLATE.MATCH(key, LOTTO_PRIZE[key], count));
  }

  static printPurchasedLottos(lottoCount, lottoNumbersList) {
    this.print(`\n${lottoCount}개를 구매했습니다.`);

    lottoNumbersList.forEach((numbers) => {
      this.print(`[${numbers.join(', ')}]`);
    });
  }
}

export default OutputHandler;
