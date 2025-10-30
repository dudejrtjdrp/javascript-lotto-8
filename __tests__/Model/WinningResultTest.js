// __tests__/Model/WinningResultTest.js
import WinningResult from '../../src/Model/WinningResult.js';
import Lotto from '../../src/Model/Lotto.js';

describe('WinningResult 클래스 테스트', () => {
  test('초기 생성 시 모든 매칭 개수는 0이어야 한다', () => {
    const result = new WinningResult();
    expect(result.getMatchCounts()).toEqual({
      3: 0,
      4: 0,
      5: 0,
      '5BONUS': 0,
      6: 0,
    });
  });

  test('recordMatches가 로또 맞춘 개수를 올바르게 기록해야 한다', () => {
    const result = new WinningResult();

    // 가짜 로또 생성
    const lotto1 = new Lotto([1, 2, 3, 4, 5, 6]); // 6개 일치
    const lotto2 = new Lotto([1, 2, 3, 4, 5, 7]); // 5개 일치
    const lotto3 = new Lotto([1, 2, 3, 4, 5, 8]); // 5개 + 보너스
    const lotto4 = new Lotto([1, 2, 3, 7, 8, 9]); // 3개 일치

    const winningNumbers = [1, 2, 3, 4, 5, 6];
    const bonusNumber = 8;

    result.recordMatches([lotto1, lotto2, lotto3, lotto4], winningNumbers, bonusNumber);

    expect(result.getMatchCount('6')).toBe(1);
    expect(result.getMatchCount('5')).toBe(1);
    expect(result.getMatchCount('5BONUS')).toBe(1);
    expect(result.getMatchCount('3')).toBe(1);
    expect(result.getMatchCount('4')).toBe(0);
  });

  test('getMatchCount는 없는 키일 경우 0을 반환해야 한다', () => {
    const result = new WinningResult();
    expect(result.getMatchCount('UNKNOWN')).toBe(0);
  });
});
