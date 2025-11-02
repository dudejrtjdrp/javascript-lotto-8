import { VALIDATION_ERROR } from './constants.js';

const Validation = {
  validateTotalAmount(amountInput) {
    const amount = amountInput;
    if (!/^[0-9]*$/.test(amount)) {
      throw new Error(VALIDATION_ERROR.INVALID_FORMAT);
    }
    if (amount < 1000) {
      throw new Error(VALIDATION_ERROR.INVALID_AMOUNT);
    }
    if (amount % 1000 !== 0) {
      throw new Error(VALIDATION_ERROR.INVALID_UNIT);
    }
  },

  validateLottoNumbers(numbersInput) {
    if (numbersInput.includes(' ')) {
      throw new Error(VALIDATION_ERROR.INVALID_FORMAT);
    }

    const lottoNumbers = numbersInput.split(',').map(Number);

    if (lottoNumbers.length !== 6) {
      throw new Error(VALIDATION_ERROR.INVALID_COUNT);
    }

    for (const number of lottoNumbers) {
      if (!Number.isInteger(number) || number < 1 || number > 45) {
        throw new Error(VALIDATION_ERROR.NUMBER_RANGE);
      }
    }

    const uniqueLottoNumbers = new Set(lottoNumbers);
    if (uniqueLottoNumbers.size !== lottoNumbers.length) {
      throw new Error(VALIDATION_ERROR.REDUNDANT);
    }
  },

  validateBonusNumber(bonusInput, winningNumbers = []) {
    const bonusNumber = Number(bonusInput.trim());
    if (!Number.isInteger(bonusNumber) || bonusNumber < 1 || bonusNumber > 45) {
      throw new Error(VALIDATION_ERROR.BONUS_NUMBER_RANGE);
    }
    if (winningNumbers.includes(bonusNumber)) {
      throw new Error(VALIDATION_ERROR.BONUS_REDUNDANT);
    }
  },
};

export default Validation;
