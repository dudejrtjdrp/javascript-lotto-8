import Validation from '../../src/Util/validation.js';
import { VALIDATION_ERROR } from '../../src/Util/constants.js';

describe('Validation 모듈 테스트', () => {
  describe('구매 금액 검증', () => {
    test('정상적인 금액은 통과한다', () => {
      expect(() => Validation.validateTotalAmount('1000')).not.toThrow();
      expect(() => Validation.validateTotalAmount('5000')).not.toThrow();
      expect(() => Validation.validateTotalAmount('100000')).not.toThrow();
    });

    test('1000원 미만은 에러를 발생시킨다', () => {
      expect(() => Validation.validateTotalAmount('500')).toThrow(VALIDATION_ERROR.INVALID_AMOUNT);
      expect(() => Validation.validateTotalAmount('0')).toThrow(VALIDATION_ERROR.INVALID_AMOUNT);
    });

    test('1000원 단위가 아니면 에러를 발생시킨다', () => {
      expect(() => Validation.validateTotalAmount('1500')).toThrow(VALIDATION_ERROR.INVALID_UNIT);
      expect(() => Validation.validateTotalAmount('2100')).toThrow(VALIDATION_ERROR.INVALID_UNIT);
    });

    test('정수가 아닌 값은 에러를 발생시킨다', () => {
      expect(() => Validation.validateTotalAmount('abc')).toThrow(VALIDATION_ERROR.INVALID_FORMAT);
      expect(() => Validation.validateTotalAmount('1000.5')).toThrow(
        VALIDATION_ERROR.INVALID_FORMAT,
      );
    });

    test('음수는 에러를 발생시킨다', () => {
      expect(() => Validation.validateTotalAmount('-1000')).toThrow(
        VALIDATION_ERROR.INVALID_FORMAT,
      );
    });
  });

  describe('당첨 번호 검증', () => {
    test('정상적인 번호는 통과한다', () => {
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,6')).not.toThrow();
      expect(() => Validation.validateLottoNumbers('10,20,30,40,41,42')).not.toThrow();
    });

    test('6개가 아닌 경우 에러를 발생시킨다', () => {
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5')).toThrow(
        VALIDATION_ERROR.INVALID_COUNT,
      );
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,6,7')).toThrow(
        VALIDATION_ERROR.INVALID_COUNT,
      );
    });

    test('1~45 범위를 벗어나면 에러를 발생시킨다', () => {
      expect(() => Validation.validateLottoNumbers('0,1,2,3,4,5')).toThrow(
        VALIDATION_ERROR.NUMBER_RANGE,
      );
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,46')).toThrow(
        VALIDATION_ERROR.NUMBER_RANGE,
      );
    });

    test('중복된 번호가 있으면 에러를 발생시킨다', () => {
      expect(() => Validation.validateLottoNumbers('1,1,2,3,4,5')).toThrow(
        VALIDATION_ERROR.REDUNDANT,
      );
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,5')).toThrow(
        VALIDATION_ERROR.REDUNDANT,
      );
    });

    test('정수가 아닌 값이 포함되면 에러를 발생시킨다', () => {
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,a')).toThrow(
        VALIDATION_ERROR.NUMBER_RANGE,
      );
      expect(() => Validation.validateLottoNumbers('1.5,2,3,4,5,6')).toThrow(
        VALIDATION_ERROR.NUMBER_RANGE,
      );
    });
  });

  describe('보너스 번호 검증', () => {
    const winningNumbers = [1, 2, 3, 4, 5, 6];

    test('정상적인 보너스 번호는 통과한다', () => {
      expect(() => Validation.validateBonusNumber('7', winningNumbers)).not.toThrow();
      expect(() => Validation.validateBonusNumber('45', winningNumbers)).not.toThrow();
    });

    test('1~45 범위를 벗어나면 에러를 발생시킨다', () => {
      expect(() => Validation.validateBonusNumber('0', winningNumbers)).toThrow(
        VALIDATION_ERROR.BONUS_NUMBER_RANGE,
      );
      expect(() => Validation.validateBonusNumber('46', winningNumbers)).toThrow(
        VALIDATION_ERROR.BONUS_NUMBER_RANGE,
      );
    });

    test('당첨 번호와 중복되면 에러를 발생시킨다', () => {
      expect(() => Validation.validateBonusNumber('1', winningNumbers)).toThrow(
        VALIDATION_ERROR.BONUS_REDUNDANT,
      );
      expect(() => Validation.validateBonusNumber('6', winningNumbers)).toThrow(
        VALIDATION_ERROR.BONUS_REDUNDANT,
      );
    });

    test('정수가 아니면 에러를 발생시킨다', () => {
      expect(() => Validation.validateBonusNumber('7.5', winningNumbers)).toThrow(
        VALIDATION_ERROR.BONUS_NUMBER_RANGE,
      );
      expect(() => Validation.validateBonusNumber('abc', winningNumbers)).toThrow(
        VALIDATION_ERROR.BONUS_NUMBER_RANGE,
      );
    });
  });
});
