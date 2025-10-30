export const BLANK = '';

export const INPUT_COMMENT = {
  FIRST: '구입금액을 입력해 주세요.',
  SECOND: '당첨 번호를 입력해 주세요.',
  THIRD: '보너스 번호를 입력해 주세요.',
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
