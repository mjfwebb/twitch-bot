/**
 * Calculates the difference between two dates in terms of years, months, days, hours, minutes, and seconds.
 * @param earlierDate - The earlier date.
 * @param laterDate - The later date.
 * @returns An object representing the difference between the dates in each unit.
 */
function dateDifference(
  earlierDate: Date,
  laterDate: Date,
): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
} {
  const result = {
    year: laterDate.getFullYear() - earlierDate.getFullYear(),
    month: laterDate.getMonth() - earlierDate.getMonth(),
    day: laterDate.getDate() - earlierDate.getDate(),
    hour: laterDate.getHours() - earlierDate.getHours(),
    minute: laterDate.getMinutes() - earlierDate.getMinutes(),
    second: laterDate.getSeconds() - earlierDate.getSeconds(),
  };

  if (result.second < 0) {
    result.minute--;
    result.second += 60;
  }
  if (result.minute < 0) {
    result.hour--;
    result.minute += 60;
  }
  if (result.hour < 0) {
    result.day--;
    result.hour += 24;
  }
  if (result.day < 0) {
    result.month--;
    // Calculate remaining days when crossing month boundary:
    // 1. Set date to 32 to determine the last day of the month
    // 2. Calculate: (days remaining in earlier month) + (days passed in later month)
    // Note: Using 32 ensures we get the actual last day of any month
    const earlierDateCopy = new Date(earlierDate.getTime());
    earlierDateCopy.setDate(32);
    result.day = 32 - earlierDate.getDate() - earlierDateCopy.getDate() + laterDate.getDate();
  }
  if (result.month < 0) {
    result.year--;
    result.month += 12;
  }
  return result;
}

/**
 * Adds an "s" to the given string if the amount is greater than 1.
 * @param str - The string to modify.
 * @param amount - The amount to determine whether to add "s".
 * @returns The modified string with "s" added if necessary.
 */
function addS(str: string, amount: number): string {
  if (amount === 1) {
    return str;
  }
  return `${str}s`;
}

/**
 * Calculates the time difference between two dates and returns it as a string.
 * @param pastDate - The past date.
 * @param futureDate - The future date.
 * @returns A formatted string representing the time difference between the dates.
 */

export function timeBetweenDates(pastDate: Date, futureDate: Date): string {
  const dateDifferences = dateDifference(pastDate, futureDate);
  const output: string[] = [];
  Object.entries(dateDifferences).forEach(([unit, value]) => {
    if (value !== 0) {
      output.push(`${value} ${addS(unit, value)}`);
    }
  });
  return output.join(', ');
}
