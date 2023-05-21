import { MINUTE_MS } from '../constants';

/**
 * Converts milliseconds to a human-readable time string representation.
 * @param ms - The number of milliseconds.
 * @returns A formatted string representing the time in the appropriate unit (ms, seconds, minutes, or hours).
 */
export function msToTimeString(ms: number): string {
  if (ms < 1000) {
    return `${ms} ms`;
  }
  if (ms >= 1000 && ms < MINUTE_MS) {
    return `${ms / 1000} seconds`;
  }
  if (ms >= MINUTE_MS && ms < MINUTE_MS * 60) {
    return `${ms / 1000 / 60} minutes`;
  }

  return `${ms / 1000 / 60 / 60} hours`;
}
