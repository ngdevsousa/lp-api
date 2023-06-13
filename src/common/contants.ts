export const RANDOM_BASE_URL = 'https://www.random.org/strings'
export const JWT_EXP_IN_SECONDS = 14400
export const DEFAULT_ROLE = 'user'
export const DEFAULT_BALANCE = 100;
export const OP_COSTS = {
    'addition': 1,
    'subtraction': 1,
    'multiplication': 2,
    'division': 2,
    'square_root': 4,
    'random_string': 8
}
export const ERROR_MESSAGES = {
    NO_BALANCE: 'Insufficient balance. Please ensure your account has sufficient funds and try again',
    INVALID_OP: 'Operation Not Allowed',
    UNSUPPORTED_OP: 'Operation Not Supported',
    INTERNAL: 'Something went wrong',
    INVALID_LOGIN: 'Invalid login/password',
    INVALID_USERNAME: 'Username already in use'
}

export const RECORD_FIELDS = [
    'record.id',
    'record.amount',
    'record.user_balance',
    'record.operation_response',
    'record.date'
]