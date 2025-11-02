import WinningResult from '../../src/Model/WinningResult.js';
import Lotto from '../../src/Model/Lotto.js';

describe('WinningResult 클래스 테스트', () => {
  describe('초기화', () => {
    test('모든 등수의 당첨 개수가 0으로 초기화되어야 한다', () => {
      const result = new WinningResult();
      const matchCounts = result.getMatchCounts();

      expect(matchCounts['3'].count).toBe(0);
      expect(matchCounts['4'].count).toBe(0);
      expect(matchCounts['5'].count).toBe(0);
      expect(matchCounts['5BONUS'].count).toBe(0);
      expect(matchCounts['6'].count).toBe(0);
    });
  });
});

describe('당첨 기록', () => {
  test('3개 일치 시 5등으로 기록된다', () => {
    const result = new WinningResult();
    const lottos = [new Lotto([1, 2, 3, 10, 11, 12])];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches(lottos, winningNumbers, bonusNumber);

    expect(result.getMatchCount('3')).toBe(1);
  });

  test('4개 일치 시 4등으로 기록된다', () => {
    const result = new WinningResult();
    const lottos = [new Lotto([1, 2, 3, 4, 10, 11])];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches(lottos, winningNumbers, bonusNumber);

    expect(result.getMatchCount('4')).toBe(1);
  });

  test('5개 일치 시 3등으로 기록된다', () => {
    const result = new WinningResult();
    const lottos = [new Lotto([1, 2, 3, 4, 5, 10])];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches(lottos, winningNumbers, bonusNumber);

    expect(result.getMatchCount('5')).toBe(1);
  });

  test('5개 일치 + 보너스 일치 시 2등으로 기록된다', () => {
    const result = new WinningResult();
    const lottos = [new Lotto([1, 2, 3, 4, 5, 7])];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches(lottos, winningNumbers, bonusNumber);

    expect(result.getMatchCount('5BONUS')).toBe(1);
  });

  test('6개 일치 시 1등으로 기록된다', () => {
    const result = new WinningResult();
    const lottos = [new Lotto([1, 2, 3, 4, 5, 6])];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches(lottos, winningNumbers, bonusNumber);

    expect(result.getMatchCount('6')).toBe(1);
  });

  test('2개 이하 일치 시 당첨되지 않는다', () => {
    const result = new WinningResult();
    const lottos = [new Lotto([1, 2, 10, 11, 12, 13])];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches(lottos, winningNumbers, bonusNumber);

    const matchCounts = result.getMatchCounts();
    expect(matchCounts['3'].count).toBe(0);
    expect(matchCounts['4'].count).toBe(0);
    expect(matchCounts['5'].count).toBe(0);
    expect(matchCounts['5BONUS'].count).toBe(0);
    expect(matchCounts['6'].count).toBe(0);
  });

  test('getMatchCounts는 전체 당첨 정보를 반환한다.', () => {
    const winningResult = new WinningResult();
    const lottos = [new Lotto([1, 2, 3, 4, 5, 6])];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    winningResult.recordMatches(lottos, winningNumbers, bonusNumber);
    const matchCounts = winningResult.getMatchCounts();

    expect(matchCounts).toHaveProperty('3');
    expect(matchCounts).toHaveProperty('4');
    expect(matchCounts).toHaveProperty('5');
    expect(matchCounts).toHaveProperty('5BONUS');
    expect(matchCounts).toHaveProperty('6');
  });
});

describe('여러 로또 처리', () => {
  test('여러 장의 로또를 동시에 처리할 수 있다', () => {
    const result = new WinningResult();
    const lottos = [
      new Lotto([1, 2, 3, 4, 5, 6]), // 1등
      new Lotto([1, 2, 3, 4, 5, 7]), // 2등
      new Lotto([1, 2, 3, 4, 5, 10]), // 3등
      new Lotto([1, 2, 3, 4, 10, 11]), // 4등
      new Lotto([1, 2, 3, 10, 11, 12]), // 5등
      new Lotto([10, 11, 12, 13, 14, 15]), // 꽝
    ];
    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 7;

    result.recordMatches(lottos, winningNumbers, bonusNumber);

    const matchCounts = result.getMatchCounts();
    expect(result.getMatchCount('6')).toBe(1);
    expect(result.getMatchCount('5BONUS')).toBe(1);
    expect(result.getMatchCount('5')).toBe(1);
    expect(result.getMatchCount('4')).toBe(1);
    expect(result.getMatchCount('3')).toBe(1);
  });
});
