import { describe, expect, test } from 'vitest';

import { timeBetweenDates } from './timeBetweenDates';

describe('find difference between past date and future date', () => {
  test('difference of 1 day and 10 seconds', () => {
    const pastDate = new Date('2023-01-22 00:00:00');
    const futureDate = new Date('2023-01-23 00:00:10');
    const output = timeBetweenDates(pastDate, futureDate);
    expect(output).toEqual('1 day, 10 seconds');
  });
  test('difference of 2 months, 13 days, 8 hours, 30 minutes, 10 seconds', () => {
    const pastDate = new Date('2023-01-10 00:30:00');
    const futureDate = new Date('2023-03-23 09:00:10');
    const output = timeBetweenDates(pastDate, futureDate);
    expect(output).toEqual('2 months, 13 days, 8 hours, 30 minutes, 10 seconds');
  });
});
