import {
  getNextDay,
  isBusinessDay,
  differenceDays,
  differenceBusinessDays,
  indexOfDate,
  findDate,
  indexOfLatestDateBefore,
  indexOfEarliestDateAfter,
  getPreviousBusinessDayRates,
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

describe('differenceBusinessDays', () => {
  it('should return the difference of days between two dates', () => {
    expect(differenceBusinessDays(new Date('2008-05-21'), new Date('2014-03-07'))).toBe(1459);
    expect(differenceBusinessDays(new Date('2008-05-21'), new Date('2014-03-10'))).toBe(1460);
    expect(differenceBusinessDays(new Date('2020-02-18'), new Date('2025-03-05'))).toBe(1265);
    expect(differenceBusinessDays(new Date('2020-02-18'), new Date('2025-02-26'))).toBe(1262);

    expect(differenceBusinessDays(new Date('2020-02-17'), new Date('2020-02-25'))).toBe(5);
    expect(differenceBusinessDays(new Date('2020-02-18'), new Date('2020-02-26'))).toBe(4);
    expect(differenceBusinessDays(new Date('2020-02-19'), new Date('2020-02-27'))).toBe(4);
    expect(differenceBusinessDays(new Date('2020-02-20'), new Date('2020-02-28'))).toBe(4);
    expect(differenceBusinessDays(new Date('2020-02-21'), new Date('2020-02-29'))).toBe(4);
    expect(differenceBusinessDays(new Date('2020-02-22'), new Date('2020-03-01'))).toBe(3);
    expect(differenceBusinessDays(new Date('2020-02-23'), new Date('2020-03-02'))).toBe(3);
    expect(differenceBusinessDays(new Date('2020-02-24'), new Date('2020-03-03'))).toBe(4);
    expect(differenceBusinessDays(new Date('2020-02-25'), new Date('2020-03-04'))).toBe(5);
    expect(differenceBusinessDays(new Date('2020-02-26'), new Date('2020-03-05'))).toBe(6);
    expect(differenceBusinessDays(new Date('2020-02-27'), new Date('2020-03-06'))).toBe(6);
    expect(differenceBusinessDays(new Date('2020-02-28'), new Date('2020-03-07'))).toBe(6);
    expect(differenceBusinessDays(new Date('2020-02-29'), new Date('2020-03-08'))).toBe(5);
  });
});

describe('indexOfDate', () => {
  it('should return the index of a given date', () => {
    expect(indexOfDate(new Date('2020-02-26'))).toBe(8450);
    expect(indexOfDate(new Date('2020-02-28'))).toBe(8452);
  });
  it('should return -1 for weekends', () => {
    expect(indexOfDate(new Date('2019-03-02'))).toBe(-1);
    expect(indexOfDate(new Date('2020-02-22'))).toBe(-1);
    expect(indexOfDate(new Date('2020-02-23'))).toBe(-1);
  });
  it('should return -1 for holidays', () => {
    expect(indexOfDate(new Date('2020-01-01'))).toBe(-1);
    expect(indexOfDate(new Date('2019-03-04'))).toBe(-1);
    expect(indexOfDate(new Date('2019-03-05'))).toBe(-1);
    expect(indexOfDate(new Date('2020-02-24'))).toBe(-1);
  });
});

describe('indexOfLatestDateBefore', () => {
  it('should return the index of a given date', () => {
    expect(indexOfLatestDateBefore(new Date('2020-02-17'))).toBe(8445);
    expect(indexOfLatestDateBefore(new Date('2020-02-18'))).toBe(8446);
    expect(indexOfLatestDateBefore(new Date('2020-02-19'))).toBe(8447);
    expect(indexOfLatestDateBefore(new Date('2020-02-20'))).toBe(8448);
    expect(indexOfLatestDateBefore(new Date('2020-02-21'))).toBe(8449);
    expect(indexOfLatestDateBefore(new Date('2020-02-22'))).toBe(8449);
    expect(indexOfLatestDateBefore(new Date('2020-02-23'))).toBe(8449);
    expect(indexOfLatestDateBefore(new Date('2020-02-24'))).toBe(8449);
    expect(indexOfLatestDateBefore(new Date('2020-02-25'))).toBe(8449);
    expect(indexOfLatestDateBefore(new Date('2020-02-26'))).toBe(8450);
    expect(indexOfLatestDateBefore(new Date('2020-02-27'))).toBe(8451);
    expect(indexOfLatestDateBefore(new Date('2020-02-28'))).toBe(8452);
    expect(indexOfLatestDateBefore(new Date('2020-02-29'))).toBe(8452);
  });
});

describe('indexOfEarliestDateAfter', () => {
  it('should return the index of a given date', () => {
    expect(indexOfEarliestDateAfter(new Date('2020-02-17'))).toBe(8445);
    expect(indexOfEarliestDateAfter(new Date('2020-02-18'))).toBe(8446);
    expect(indexOfEarliestDateAfter(new Date('2020-02-19'))).toBe(8447);
    expect(indexOfEarliestDateAfter(new Date('2020-02-20'))).toBe(8448);
    expect(indexOfEarliestDateAfter(new Date('2020-02-21'))).toBe(8449);
    expect(indexOfEarliestDateAfter(new Date('2020-02-22'))).toBe(8450);
    expect(indexOfEarliestDateAfter(new Date('2020-02-23'))).toBe(8450);
    expect(indexOfEarliestDateAfter(new Date('2020-02-24'))).toBe(8450);
    expect(indexOfEarliestDateAfter(new Date('2020-02-25'))).toBe(8450);
    expect(indexOfEarliestDateAfter(new Date('2020-02-26'))).toBe(8450);
    expect(indexOfEarliestDateAfter(new Date('2020-02-27'))).toBe(8451);
    expect(indexOfEarliestDateAfter(new Date('2020-02-28'))).toBe(8452);
    expect(indexOfEarliestDateAfter(new Date('2020-02-29'))).toBe(8453);
  });
});

describe('findDate', () => {
  it('should return the object with the taxes for a given date', () => {
    expect(findDate(new Date('2020-02-26'))).toStrictEqual({
      date: new Date('2020-02-26'),
      sellSelicTax: 0.0003,
      yearlySelic: '4.15',
      dailySelic: '1.00016137',
    });
  });
  it('should return an object only a date for dates in the future', () => {
    expect(findDate(new Date('2025-06-18'))).toStrictEqual({
      date: new Date('2025-06-18'),
    });
  });
  it('should return null for weekends and holidays', () => {
    expect(findDate(new Date('2020-02-23'))).toBeNull();
    expect(findDate(new Date('2019-03-04'))).toBeNull();
  });
  it('should return sellSelicTax as 0.0003 before 2020-02-29', () => {
    expect(findDate(new Date('2020-02-03')).sellSelicTax).toBe(0.0003);
    expect(findDate(new Date('2020-02-26')).sellSelicTax).toBe(0.0003);
  });
  it('should return sellSelicTax as 0.0004 after 2020-02-29', () => {
    expect(findDate(new Date('2020-03-09')).sellSelicTax).toBe(0.0004);
    expect(findDate(new Date('2020-03-23')).sellSelicTax).toBe(0.0004);
  });
});

describe('getPreviousBusinessDayRates', () => {
  it('should return the object with the taxes from the business day before the parameter', () => {
    expect(getPreviousBusinessDayRates(new Date('2020-02-26'))).toStrictEqual({
      date: new Date('2020-02-21'),
      sellSelicTax: 0.0003,
      yearlySelic: '4.15',
      dailySelic: '1.00016137',
    });
  });
  it('should return the correct business days', () => {
    expect(getPreviousBusinessDayRates(new Date('2020-01-27')).date).toStrictEqual(new Date('2020-01-24'));
    expect(getPreviousBusinessDayRates(new Date('2020-01-02')).date).toStrictEqual(new Date('2019-12-31'));
  });
});
