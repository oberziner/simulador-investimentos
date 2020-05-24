import {
  getNextDay,
  isBusinessDay,
  differenceDays,
  previousDateWithDayOfMonth,
  nextDateWithDayOfMonth,
  firstDayOfPreviousMonth,
} from './dates';

describe('getNextDay', () => {
  it('should return the next day', () => {
    expect.hasAssertions();
    expect(getNextDay(new Date('2019-01-01'))).toStrictEqual(new Date('2019-01-02'));
    expect(getNextDay(new Date('2018-12-31'))).toStrictEqual(new Date('2019-01-01'));
    expect(getNextDay(new Date('2020-02-28'))).toStrictEqual(new Date('2020-02-29'));
    expect(getNextDay(new Date('2020-02-29'))).toStrictEqual(new Date('2020-03-01'));
  });
  it('should return the next day even when DST starts/ends', () => {
    expect(getNextDay(new Date('2018-11-03'))).toStrictEqual(new Date('2018-11-04'));
    expect(getNextDay(new Date('2018-11-04'))).toStrictEqual(new Date('2018-11-05'));
    expect(getNextDay(new Date('2018-11-05'))).toStrictEqual(new Date('2018-11-06'));
    expect(getNextDay(new Date('2019-02-15'))).toStrictEqual(new Date('2019-02-16'));
    expect(getNextDay(new Date('2019-02-16'))).toStrictEqual(new Date('2019-02-17'));
    expect(getNextDay(new Date('2019-02-17'))).toStrictEqual(new Date('2019-02-18'));
  });
});

describe('isBusinessDay', () => {
  it('should return true for business days', () => {
    expect(isBusinessDay(new Date('2020-02-26'))).toBe(true);
  });
  it('should return false for weekends', () => {
    expect(isBusinessDay(new Date('2019-03-02'))).toBe(false);
    expect(isBusinessDay(new Date('2020-02-22'))).toBe(false);
    expect(isBusinessDay(new Date('2020-02-23'))).toBe(false);
  });
  it('should return false for holidays', () => {
    expect(isBusinessDay(new Date('2020-01-01'))).toBe(false);
    expect(isBusinessDay(new Date('2019-03-04'))).toBe(false);
    expect(isBusinessDay(new Date('2019-03-05'))).toBe(false);
    expect(isBusinessDay(new Date('2020-02-24'))).toBe(false);
  });
});

describe('differenceDays', () => {
  it('should return the difference of days between two dates', () => {
    expect(differenceDays(new Date('2019-01-01'), new Date('2019-01-02'))).toBe(1);
    expect(differenceDays(new Date('2019-01-01'), new Date('2019-02-01'))).toBe(31);
    expect(differenceDays(new Date('2019-01-01'), new Date('2020-01-01'))).toBe(365);
    expect(differenceDays(new Date('2020-01-01'), new Date('2021-01-01'))).toBe(366);
  });
});

describe('previousDateWithDayOfMonth', () => {
  it('should return the last date before date which had a day equal to the day parameter', () => {
    expect(previousDateWithDayOfMonth(new Date('2020-01-01'), 15)).toStrictEqual(new Date('2019-12-15'));
    expect(previousDateWithDayOfMonth(new Date('2020-01-14'), 15)).toStrictEqual(new Date('2019-12-15'));
    expect(previousDateWithDayOfMonth(new Date('2020-01-15'), 15)).toStrictEqual(new Date('2019-12-15'));
    expect(previousDateWithDayOfMonth(new Date('2020-01-16'), 15)).toStrictEqual(new Date('2020-01-15'));
    expect(previousDateWithDayOfMonth(new Date('2020-02-10'), 15)).toStrictEqual(new Date('2020-01-15'));
  });
});

describe('nextDateWithDayOfMonth', () => {
  it('should return the first date after date which had a day equal to the day parameter', () => {
    expect(nextDateWithDayOfMonth(new Date('2019-12-20'), 15)).toStrictEqual(new Date('2020-01-15'));
    expect(nextDateWithDayOfMonth(new Date('2020-01-01'), 15)).toStrictEqual(new Date('2020-01-15'));
    expect(nextDateWithDayOfMonth(new Date('2020-01-14'), 15)).toStrictEqual(new Date('2020-01-15'));
    expect(nextDateWithDayOfMonth(new Date('2020-01-15'), 15)).toStrictEqual(new Date('2020-01-15'));
    expect(nextDateWithDayOfMonth(new Date('2020-01-16'), 15)).toStrictEqual(new Date('2020-02-15'));
    expect(nextDateWithDayOfMonth(new Date('2020-02-10'), 15)).toStrictEqual(new Date('2020-02-15'));
  });
});

describe('firstDayOfPreviousMonth', () => {
  it('should return the first day of the previous month', () => {
    expect(firstDayOfPreviousMonth(new Date('2020-04-15'))).toStrictEqual(new Date('2020-03-01'));
    expect(firstDayOfPreviousMonth(new Date('2020-04-01'))).toStrictEqual(new Date('2020-03-01'));
    expect(firstDayOfPreviousMonth(new Date('2020-01-02'))).toStrictEqual(new Date('2019-12-01'));
    expect(firstDayOfPreviousMonth(new Date('2020-01-01'))).toStrictEqual(new Date('2019-12-01'));
    expect(firstDayOfPreviousMonth(new Date('2019-12-31'))).toStrictEqual(new Date('2019-11-01'));
  });
});
