import { Random, Console } from '@woowacourse/mission-utils';

class App {
  constructor() {
    this.status = 'isPlaying';
    this.computerNumber = [];
  }

  setStatus(value) {
    this.status = value;
  }

  setComputerNumber() {
    const randomNumber = [];

    while (randomNumber.length < 3) {
      const num = Random.pickNumberInRange(1, 9);
      if (!randomNumber.includes(num)) randomNumber.push(num);
    }

    this.computerNumber = randomNumber;
  }

  async setPlayerNumber() {
    const inputNumber = await Console.readLineAsync('숫자를 입력해주세요 : ');

    if (!inputNumber.match(/^[1-9]{3}$/)) {
      throw new Error('[ERROR] 세자리 숫자를 입력해주세요.');
    }

    const playerNumber = inputNumber.split('').map(item => +item);

    const duplicate = arr => {
      return arr.some((item, index) => arr.indexOf(item) !== index);
    };

    if (duplicate(playerNumber)) {
      throw new Error('[ERROR] 숫자가 중복되지 않도록 입력해주세요.');
    }

    return playerNumber;
  }

  printCount(playerNumber) {
    let ballCount = 0;
    let strikeCount = 0;

    this.computerNumber.forEach((item, index) =>
      item === playerNumber[index]
        ? (strikeCount += 1)
        : playerNumber.includes(item) && (ballCount += 1),
    );

    const ballMessage = ballCount ? `${ballCount}볼` : '';
    const strikeMessage = strikeCount ? `${strikeCount}스트라이크` : '';
    const messageSpace = strikeCount && ballCount ? ' ' : '';

    const message = !(strikeCount || ballCount)
      ? '낫싱'
      : ballMessage + messageSpace + strikeMessage;

    Console.print(message);

    this.setStatus(strikeCount === 3 ? 'isSuccess' : 'isPlaying');
  }

  async resetGame() {
    const input = await Console.readLineAsync(
      '게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n',
    );

    if (!(input === '1' || input === '2')) {
      throw new Error('[ERROR] 값을 잘못 입력하였습니다. 게임을 종료합니다.');
    }

    if (input === '1') this.setStatus('isPlaying');
    if (input === '2') this.setStatus('isQuit');
  }

  async play() {
    Console.print('숫자 야구 게임을 시작합니다.');

    while (this.status === 'isPlaying') {
      this.setComputerNumber();

      while (!(this.status === 'isSuccess')) {
        const playerNumber = await this.setPlayerNumber();
        this.printCount(playerNumber);
      }

      Console.print('3개의 숫자를 모두 맞히셨습니다! 게임 종료');
      await this.resetGame();
    }
  }
}

export default App;
