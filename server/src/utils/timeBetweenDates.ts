/**
 * Calculates the difference between two dates in terms of years, months, days, hours, minutes, and seconds.
 * @param date1 - The first date.
 * @param date2 - The second date.
 * @returns An object representing the difference between the dates in each unit.
 */
function dateDifference(date1: Date, date2: Date): { year: number; month: number; day: number; hour: number; minute: number; second: number } {
  const result = {
    year: date2.getFullYear() - date1.getFullYear(),
    month: date2.getMonth() - date1.getMonth(),
    day: date2.getDate() - date1.getDate(),
    hour: date2.getHours() - date1.getHours(),
    minute: date2.getMinutes() - date1.getMinutes(),
    second: date2.getSeconds() - date1.getSeconds(),
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
    // days = days left in date1's month,
    //   plus days that have passed in date2's month
    const date1Copy = new Date(date1.getTime());
    date1Copy.setDate(32);
    result.day = 32 - date1.getDate() - date1Copy.getDate() + date2.getDate();
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
