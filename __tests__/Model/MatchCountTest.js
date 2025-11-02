import MatchCount from '../../src/Model/MatchCount.js';
import { LOTTO_PRIZE } from '../../src/Util/constants.js';

describe('MatchCount 클래스 테스트', () => {
  let matchCount;

  beforeEach(() => {
    matchCount = new MatchCount(3);
  });

  test('생성 시 count는 0, rank와 prize가 올바르게 설정된다', () => {
    expect(matchCount.getCount()).toBe(0);
    expect(matchCount.getRank()).toBe(3);
    expect(matchCount.getPrize()).toBe(LOTTO_PRIZE[3]);
    expect(matchCount.getTotalPrize()).toBe(0);
  });

  test('increment 메서드는 count를 1 증가시킨다', () => {
    matchCount.increment();
    expect(matchCount.getCount()).toBe(1);
    matchCount.increment();
    expect(matchCount.getCount()).toBe(2);
  });

  test('getTotalPrize는 카운트 * 상금을 반환한다.', () => {
    const matchCount = new MatchCount(4);
    matchCount.increment();
    matchCount.increment();
    expect(matchCount.getTotalPrize()).toBe(LOTTO_PRIZE[4] * 2);
  });

  test('getRank는 등수를 반환한다.', () => {
    const matchCount = new MatchCount('5BONUS');
    expect(matchCount.getRank()).toBe('5BONUS');
  });
});
