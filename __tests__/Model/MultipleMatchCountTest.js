import MultipleMatchCount from '../../src/Model/MultipleMatchCount.js';
import MatchCount from '../../src/Model/MatchCount.js';
import { LOTTO_PRIZE } from '../../src/Util/constants.js';

describe('MultipleMatchCount 클래스 테스트', () => {
  let multipleMatchCount;

  beforeEach(() => {
    multipleMatchCount = new MultipleMatchCount();
  });

  test('생성 시 각 rank별 MatchCount 인스턴스가 생성되어 있어야 한다', () => {
    const multipleMatchCount = new MultipleMatchCount();
    const all = multipleMatchCount.getAll();

    expect(Object.keys(all)).toEqual(expect.arrayContaining(['3', '4', '5', '5BONUS', '6']));

    Object.entries(all).forEach(([rank, match]) => {
      expect(match.count).toBe(0);
      expect(match.prize).toBeGreaterThan(0);
      expect(match.totalPrize).toBe(0);
    });
  });

  test('increment 메서드는 해당 rank의 count를 증가시킨다', () => {
    multipleMatchCount.increment(3);
    multipleMatchCount.increment(3);
    multipleMatchCount.increment('5BONUS');

    const all = multipleMatchCount.getAll();
    expect(all[3].count).toBe(2);
    expect(all['5BONUS'].count).toBe(1);
    expect(all[4].count).toBe(0);
  });

  test('get 메서드는 해당 rank의 count를 반환한다', () => {
    multipleMatchCount.increment(4);
    multipleMatchCount.increment(4);
    multipleMatchCount.increment(6);

    expect(multipleMatchCount.get(4)).toBe(2);
    expect(multipleMatchCount.get(6)).toBe(1);
    expect(multipleMatchCount.get(5)).toBe(0);
  });

  test('getTotalPrize는 전체 상금을 계산한다.', () => {
    multipleMatchCount.increment(3);
    multipleMatchCount.increment(4);
    multipleMatchCount.increment('5BONUS');
    multipleMatchCount.increment(6);

    const expectedTotalPrize =
      LOTTO_PRIZE[3] + LOTTO_PRIZE[4] + LOTTO_PRIZE['5BONUS'] + LOTTO_PRIZE[6];

    expect(multipleMatchCount.getTotalPrize()).toBe(expectedTotalPrize);
  });

  test('getAll 메서드는 모든 rank의 count, prize, totalPrize를 객체 형태로 반환한다', () => {
    multipleMatchCount.increment(3);
    multipleMatchCount.increment(6);
    multipleMatchCount.increment(6);

    const all = multipleMatchCount.getAll();

    expect(all[3]).toEqual({
      count: 1,
      prize: LOTTO_PRIZE[3],
      totalPrize: LOTTO_PRIZE[3],
    });

    expect(all[6]).toEqual({
      count: 2,
      prize: LOTTO_PRIZE[6],
      totalPrize: LOTTO_PRIZE[6] * 2,
    });

    expect(all['5BONUS']).toEqual({
      count: 0,
      prize: LOTTO_PRIZE['5BONUS'],
      totalPrize: 0,
    });
  });
});
