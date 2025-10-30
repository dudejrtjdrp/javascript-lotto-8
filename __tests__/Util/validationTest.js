import Validation from '../../src/Util/validation.js';
import { VALIDATION_ERROR } from '../../src/Util/constants.js';

describe('Validation 모듈 테스트', () => {
  describe('validateTotalAmount', () => {
    test('올바른 금액은 통과', () => {
      expect(() => Validation.validateTotalAmount('1000')).not.toThrow();
      expect(() => Validation.validateTotalAmount('5000')).not.toThrow();
    });

    test('1000 미만 금액은 에러', () => {
      expect(() => Validation.validateTotalAmount('500')).toThrow(VALIDATION_ERROR.INVALID_AMOUNT);
    });

    test('정수가 아닌 금액은 에러', () => {
      expect(() => Validation.validateTotalAmount('1000.5')).toThrow(
        VALIDATION_ERROR.INVALID_AMOUNT,
      );
    });

    test('1000 단위가 아니면 에러', () => {
      expect(() => Validation.validateTotalAmount('1500')).toThrow(VALIDATION_ERROR.INVALID_UNIT);
    });
  });

  describe('validateLottoNumbers', () => {
    test('올바른 로또 번호는 통과', () => {
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,6')).not.toThrow();
    });

    test('숫자 개수가 6개가 아니면 에러', () => {
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5')).toThrow(
        VALIDATION_ERROR.INVALID_COUNT,
      );
    });

    test('1~45 범위가 아니면 에러', () => {
      expect(() => Validation.validateLottoNumbers('0,2,3,4,5,6')).toThrow(
        VALIDATION_ERROR.NUMBER_RANGE,
      );
      expect(() => Validation.validateLottoNumbers('1,2,3,4,5,46')).toThrow(
        VALIDATION_ERROR.NUMBER_RANGE,
      );
    });

    test('중복된 숫자가 있으면 에러', () => {
      expect(() => Validation.validateLottoNumbers('1,2,3,3,5,6')).toThrow(
        VALIDATION_ERROR.REDUNDANT,
      );
    });

    test('숫자가 아닌 값이 있으면 에러', () => {
      expect(() => Validation.validateLottoNumbers('1,2,3,a,5,6')).toThrow(
        VALIDATION_ERROR.NUMBER_RANGE,
      );
    });
  });

  describe('validateBonusNumber', () => {
    test('올바른 보너스 번호는 통과', () => {
      expect(() => Validation.validateBonusNumber('7', [1, 2, 3, 4, 5, 6])).not.toThrow();
    });

    test('1~45 범위가 아니면 에러', () => {
      expect(() => Validation.validateBonusNumber('0', [1, 2, 3, 4, 5, 6])).toThrow(
        VALIDATION_ERROR.BONUS_NUMBER_RANGE,
      );
      expect(() => Validation.validateBonusNumber('46', [1, 2, 3, 4, 5, 6])).toThrow(
        VALIDATION_ERROR.BONUS_NUMBER_RANGE,
      );
    });

    test('당첨 번호와 중복되면 에러', () => {
      expect(() => Validation.validateBonusNumber('5', [1, 2, 3, 4, 5, 6])).toThrow(
        VALIDATION_ERROR.BONUS_REDUNDANT,
      );
    });
  });
});
