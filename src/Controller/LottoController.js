import { InputHandler, OutputHandler } from '../view/inputHandler.js';
import { INPUT_COMMENT } from '../Util/constants.js';
import Validation from '../Util/validation.js';
import MultipleLotto from '../Model/MultipleLotto.js';
import WinningResult from '../Model/WinningResult.js';

export default class LottoController {
  static async play() {
    try {
      const totalAmountInput = await InputHandler.read(INPUT_COMMENT.FIRST);
    } catch (error) {
      OutputHandler.printError(error);
      throw error;
    }
  }
}
