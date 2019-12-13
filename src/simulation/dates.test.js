import { getNextDay, isBusinessDay, differenceDays } from './dates';

describe('getNextDay', () => {
  it('should return the next day', () => {
    expect.hasAssertions();
    expect(getNextDay(new Date('2019-01-01'))).toStrictEqual(new Date('2019-01-02'));
    expect(getNextDay(new Date('2018-12-31'))).toStrictEqual(new Date('2019-01-01'));
    expect(getNextDay(new Date('2020-02-28'))).toStrictEqual(new Date('2020-02-29'));
    expect(getNextDay(new Date('2020-02-29'))).toStrictEqual(new Date('2020-03-01'));
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
