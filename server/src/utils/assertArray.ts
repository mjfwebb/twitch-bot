import assert from 'assert';

export const assertArray: (array: unknown, errorMessage?: string) => asserts array is unknown[] = (array: unknown, errorMessage?: string) => {
  assert(typeof array === 'object' && Array.isArray(array), errorMessage || '');
};
