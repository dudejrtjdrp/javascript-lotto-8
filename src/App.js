import LottoController from './Controller/LottoController.js';

class App {
  async run() {
    await LottoController.play();
  }
}

export default App;
