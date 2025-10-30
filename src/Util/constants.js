export const BLANK = '';

export const INPUT_COMMENT = {
  FIRST: '구입금액을 입력해 주세요.\n',
  SECOND: '\n당첨 번호를 입력해 주세요.\n',
  THIRD: '\n보너스 번호를 입력해 주세요.\n',
};

export const ERROR_PREFIX = '[ERROR]';
export const INPUT_ERROR = {
  EMPTY: `${ERROR_PREFIX} 입력값이 비어있습니다.`,
  INVALID_FORMAT: `${ERROR_PREFIX} 입력 형식이 올바르지 않습니다.`,
  DIMENSION_THOUSAND: `${ERROR_PREFIX} 로또 구입 금액은 1,000원 단위여야 합니다.`,
  SMALLER_THAN_THOUSAND: `${ERROR_PREFIX} 로또 구입 금액은 1,000원 이상이어야 합니다.`,
};

export const LOTTO_ERROR = {
  ARRAY: `${ERROR_PREFIX} 로또 번호는 배열이어야 합니다.`,
  COUNT_SIX: `${ERROR_PREFIX} 로또 번호는 6개여야 합니다.`,
  REDUNDANT: `${ERROR_PREFIX} 로또 번호는 중복될 수 없습니다.`,
  NUMBER_RANGE: `${ERROR_PREFIX} 로또 번호는 1부터 45 사이의 숫자여야 합니다.`,
  ASCENDING: `${ERROR_PREFIX} 로또 번호는 오름차순으로 정렬되어야 합니다.`,
};

export const MULTIPLE_LOTTO_ERROR = {
  INVALID_COUNT: `${ERROR_PREFIX} 생성할 로또 개수는 1 이상의 정수여야 합니다.`,
  COUNT_MISMATCH: `${ERROR_PREFIX} 구입금액과 Lotto의 개수가 올바르지 않습니다`,
  NOT_LOTTO_INSTANCE: `${ERROR_PREFIX} 올바른 Lotto 인스턴스가 아닙니다.`,
};

export const WINNING_ERROR = {
  INVALID_MATCH_COUNT: `${ERROR_PREFIX} 잘못된 매칭 개수입니다.`,
  NO_PRIZE: `${ERROR_PREFIX} 총 상금 계산 불가`,
  NO_PROFIT_RATE: `${ERROR_PREFIX} 수익률 계산 불가`,
};

export const VALIDATION_ERROR = {
  INVALID_AMOUNT: '[ERROR] 총 금액은 1,000원 이상이어야 합니다.',
  INVALID_UNIT: '[ERROR] 금액은 1,000원 단위여야 합니다.',
  INVALID_COUNT: '[ERROR] 로또 번호는 6개여야 합니다.',
  NUMBER_RANGE: '[ERROR] 로또 번호는 1~45 사이여야 합니다.',
  REDUNDANT: '[ERROR] 로또 번호는 중복될 수 없습니다.',
  BONUS_NUMBER_RANGE: '[ERROR] 보너스 번호는 1~45 사이여야 합니다.',
  BONUS_REDUNDANT: '[ERROR] 보너스 번호는 당첨 번호와 중복될 수 없습니다.',
};

export const LOTTO_PRIZE = {
  3: 5000,
  4: 50000,
  5: 1500000,
  '5BONUS': 30000000,
  6: 2000000000,
};
