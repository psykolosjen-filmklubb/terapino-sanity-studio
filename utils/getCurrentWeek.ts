/**
 * Calculates the ISO 8601 week number for a given date.
 * @param {Date} [date] - The date object to check. Defaults to the current date.
 * @returns {number} The ISO week number (1-53).
 */
export function getISOWeekNumber(date = new Date()) {
  // 1. Create a copy of the date object to avoid modifying the original.
  const d = new Date(date.valueOf());

  // 2. Set the date to the nearest Thursday of its week.
  // This is the core trick for ISO 8601 calculation.
  // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
  // By using `(d.getDay() || 7)`, we treat Sunday (0) as 7.
  // d.getDate() + 4 - current day number moves the date to the Thursday (day 4).
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));

  // 3. Get the first day of the year this Thursday belongs to.
  const yearStart = new Date(d.getFullYear(), 0, 1);

  // 4. Calculate the week number.
  // - (d - yearStart) is the time difference in milliseconds.
  // - Divide by 86400000 (milliseconds in a day) to get the number of days.
  // - Add 1 to include the start day.
  // - Divide by 7 to get the number of weeks.
  // - Use Math.ceil() to round up to the full week number.
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
