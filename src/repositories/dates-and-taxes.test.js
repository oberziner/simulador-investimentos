import {
  indexOfDate,
  indexOfEarliestDateAfter,
  indexOfLatestDateBefore,
  findDate,
  getPreviousBusinessDayRates,
  differenceBusinessDays,
  newRepositoryWithFuture,
} from './dates-and-taxes';


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
  it('should return -1 for dates before 1986-06-04', () => {
    expect(indexOfDate(new Date('1986-06-04'))).toBe(0);
    expect(indexOfDate(new Date('1986-06-03'))).toBe(-1);
    expect(indexOfDate(new Date('1986-06-02'))).toBe(-1);
    expect(indexOfDate(new Date('1986-01-02'))).toBe(-1);
  });
  it('should return -1 for dates after 2078-12-31', () => {
    expect(indexOfDate(new Date('2078-12-30'))).toBe(23231);
    expect(indexOfDate(new Date('2079-01-01'))).toBe(-1);
    expect(indexOfDate(new Date('2079-01-02'))).toBe(-1);
    expect(indexOfDate(new Date('2079-03-02'))).toBe(-1);
    expect(indexOfDate(new Date('2085-03-02'))).toBe(-1);
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
      yearlySelic: 4.15,
      dailySelic: 1.00016137,
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
      yearlySelic: 4.15,
      dailySelic: 1.00016137,
    });
  });
  it('should return the correct business days', () => {
    expect(getPreviousBusinessDayRates(new Date('2020-01-27')).date).toStrictEqual(new Date('2020-01-24'));
    expect(getPreviousBusinessDayRates(new Date('2020-01-02')).date).toStrictEqual(new Date('2019-12-31'));
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

describe('repositoryWithFuture', () => {
  describe('getDailySelic', () => {
    it('should return the historical rate for dates inside the period with historical dates', () => {
      const repo = newRepositoryWithFuture();
      expect(repo.getDailySelic(new Date('2010-03-29'))).toBe(1.00032927);
      expect(repo.getDailySelic(new Date('2020-02-28'))).toBe(1.00016137);
      expect(repo.getDailySelic(new Date('2020-04-09'))).toBe(1.00014227);
    });

    it('should return null for weekends and holidays inside the period with historical dates', () => {
      const repo = newRepositoryWithFuture();
      expect(repo.getDailySelic(new Date('2020-02-23'))).toBeNull();
      expect(repo.getDailySelic(new Date('2019-03-04'))).toBeNull();
    });

    it('should return the default rate for dates after the last date with historical data ', () => {
      const repo = newRepositoryWithFuture({dailySelic: 4.42});
      expect(repo.getDailySelic(new Date('2020-04-13'))).toBe(4.42);
      expect(repo.getDailySelic(new Date('2055-03-04'))).toBe(4.42);
    });
    it('should return null for weekends and holidays after the last date with historical data ', () => {
      const repo = newRepositoryWithFuture({dailySelic: 4.42});
      expect(repo.getDailySelic(new Date('2020-04-10'))).toBeNull();
      expect(repo.getDailySelic(new Date('2055-03-06'))).toBeNull();
    });
  });

  describe('getPreviousBusinessDaySelic', () => {
    it('should return the historical rate for dates inside the period with historical dates', () => {
      const repo = newRepositoryWithFuture();
      expect(repo.getPreviousBusinessDaySelic(new Date('2010-03-29'))).toBe(1.00032927);
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-02-28'))).toBe(1.00016137);
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-04-09'))).toBe(1.00014227);
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-04-13'))).toBe(1.00014227);
    });

    it('should return the historical rate for weekends and holidays if the previous business day is inside the period with historical dates', () => {
      const repo = newRepositoryWithFuture({dailySelic: 4.42});
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-02-23'))).toBe(1.00016137);
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-04-10'))).toBe(1.00014227);
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-04-11'))).toBe(1.00014227);
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-04-12'))).toBe(1.00014227);
    });

    it('should return the default rate for dates after the last date with historical data ', () => {
      const repo = newRepositoryWithFuture({dailySelic: 4.42});
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-04-14'))).toBe(4.42);
      expect(repo.getPreviousBusinessDaySelic(new Date('2055-03-04'))).toBe(4.42);
    });
    it('should return the historical rate for weekends and holidays if the previous business day is after the period with historical dates', () => {
      const repo = newRepositoryWithFuture({dailySelic: 4.42});
      expect(repo.getPreviousBusinessDaySelic(new Date('2020-04-18'))).toBe(4.42);
      expect(repo.getPreviousBusinessDaySelic(new Date('2055-03-06'))).toBe(4.42);
    });
  });
});
