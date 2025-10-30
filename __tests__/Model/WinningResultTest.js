import WinningResult from '../../src/Model/WinningResult.js';

describe('WinningResult 클래스 테스트', () => {
  let result;

  beforeEach(() => {
    result = new WinningResult(5000); // 구매 금액 5000원
  });

  test('초기 생성 시 총 상금과 매칭 결과가 0이어야 한다', () => {
    expect(result.getTotalPrize()).toBe(0);
    expect(result.getMatchCount(3)).toBe(0);
  });

  test('매칭 결과 추가 시 정상적으로 증가해야 한다', () => {
    result.addMatchCount(3);
    expect(result.getMatchCount(3)).toBe(1);

    result.addMatchCount(5);
    expect(result.getMatchCount(5)).toBe(1);
  });

  test('결과가 정의되지 않은 매칭 개수일 경우 예외 발생', () => {
    expect(() => result.addMatchCount(2)).toThrow('[ERROR] 잘못된 매칭 개수입니다.');
  });

  test('총 상금 계산 시 정상적인 경우', () => {
    result.addMatchCount(3); // 1회
    result.addMatchCount(5); // 1회
    result.addMatchCount(6); // 1회

    const total = result.calculateTotalPrize();
    expect(total).toBe(
      result.getPrizeByRank(3) + result.getPrizeByRank(5) + result.getPrizeByRank(6),
    );
  });

  test('총 상금 계산 시 매칭 결과가 없으면 예외 발생', () => {
    expect(() => result.calculateTotalPrize()).toThrow('[ERROR] 총 상금 계산 불가');
  });

  test('수익률 계산 시 총 상금이 없으면 예외 발생', () => {
    expect(() => result.calculateProfitRate()).toThrow('[ERROR] 수익률 계산 불가');
  });

  test('수익률 계산 시 정상적인 경우', () => {
    result.addMatchCount(3);
    result.addMatchCount(5);

    const totalPrize = result.calculateTotalPrize();
    const profitRate = result.calculateProfitRate();
    expect(profitRate).toBe((totalPrize / 5000) * 100);
  });
});
