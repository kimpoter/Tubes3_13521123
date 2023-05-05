/**
 * 
 * @param dateString with format DD/MM/YY
 * @returns true if string is a valid date
 */
export function isDateValid(dateString: string) {
    // further validation (for max days)
    const [dayString, monthString, yearString] = dateString.split('/');
    const day = parseInt(dayString);
    const month = parseInt(monthString);
    const year = parseInt(yearString);
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return false;
    }
    if (year < 1 || year > 9999) {
        return false;
      }
    if (month < 1 || month > 12) {
        return false;
    }
    const maxDays = getMaxDays(month, year);
    return day > 0 && day <= maxDays;
  }

/**
 * 
 * @param month 
 * @param year 
 * @returns max days of a month
 */
export function getMaxDays(month: number, year: number) {
    if (month === 2) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
            return 29; // leap year
        } else {
            return 28;
        }
    } else {
        if ([4, 6, 9, 11].includes(month)) return 30;
        return 31;
    }
}

/**
 * assumption year, month, day is valid
 * 
 * @param year 
 * @param month 
 * @param day 
 * @returns day of week in ID format
 */
export function getDayOfWeek(year: number, month: number, day: number) {
    // using Zeller's congruence for Gregorian calendar
    // In this algorithm January and February are counted as 
    // months 13 and 14 of the previous year
    // assumption year, month, day is valid
    if (month === 1 || month === 2) {
      month += 12;
      year--;
    }
    const zeroBasedCentury = Math.floor(year / 100);
    const yearOfCentury = year % 100;
    const dayOfWeekIdx =
      (day +
        Math.floor((13 * (month + 1)) / 5) +
        yearOfCentury +
        Math.floor(yearOfCentury / 4) +
        Math.floor(zeroBasedCentury / 4) -
        2 * zeroBasedCentury) %
      7;
    const daysOfWeek = ["Sabtu", "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
    return daysOfWeek[dayOfWeekIdx];
}
  
  