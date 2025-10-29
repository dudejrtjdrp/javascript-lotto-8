import { Console } from '@woowacourse/mission-utils';
import { ERROR_PREFIX } from '../Util/constants.js';

class OutputHandler {
  static print(result) {
    Console.print(result);
  }

  static printError(error) {
    if (!error) {
      Console.print(ERROR_PREFIX);
      return;
    }
    const handleError = error;
    if (typeof handleError === 'string') {
      if (!handleError.startsWith(ERROR_PREFIX)) {
        Console.print(`${ERROR_PREFIX}${handleError}`);
        return;
      }
      Console.print(handleError);
      return;
    }

    if (!handleError.message.startsWith(ERROR_PREFIX)) {
      handleError.message = `${ERROR_PREFIX}${handleError.message}`;
    }

    Console.print(`${handleError.message}`);
  }
}

export default OutputHandler;
