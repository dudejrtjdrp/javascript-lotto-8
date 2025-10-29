import { Console } from '@woowacourse/mission-utils';

class InputHandler {
  static async read(comment) {
    return Console.readLineAsync(comment);
  }
}

export default InputHandler;
