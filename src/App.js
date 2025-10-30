import LottoController from './Controller/LottoController';

class App {
  async run() {
    await LottoController.play();
  }
}

export default App;
