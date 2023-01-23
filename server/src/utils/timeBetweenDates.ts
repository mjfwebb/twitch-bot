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
    const copy1 = new Date(date1.getTime());
    copy1.setDate(32);
    result.day = 32 - date1.getDate() - copy1.getDate() + date2.getDate();
  }
  if (result.month < 0) {
    result.year--;
    result.month += 12;
  }
  return result;
}

function addS(str: string, amount: number): string {
  if (amount === 1) {
    console.log(str, amount);
    return str;
  }
  return `${str}s`;
}

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
