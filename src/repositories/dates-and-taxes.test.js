import {
  indexOfDate,
  indexOfEarliestDateAfter,
  indexOfLatestDateBefore,
  findDate,
  findDateOrPreviousDate,
  nextBusinessday,
  getPreviousBusinessDayRates,
  differenceBusinessDays,
  newRepositoryWithProjectedValues,
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
    const obj = findDate(new Date('2020-02-26'));
    expect(obj.date).toStrictEqual(new Date('2020-02-26'));
    expect(obj.selic.dailyRate()).toStrictEqual(1.00016137);
    expect(obj.selic.yearlyRate()).toStrictEqual(4.15);
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
});

describe('findDateOrPreviousDate', () => {
  it('should return the object with the taxes for a given date', () => {
    const obj = findDateOrPreviousDate(new Date('2020-02-26'));
    expect(obj.date).toStrictEqual(new Date('2020-02-26'));
    expect(obj.selic.dailyRate()).toStrictEqual(1.00016137);
    expect(obj.selic.yearlyRate()).toStrictEqual(4.15);
  });
  it('should return an object only a date for dates in the future', () => {
    expect(findDateOrPreviousDate(new Date('2025-06-18'))).toStrictEqual({
      date: new Date('2025-06-18'),
    });
  });
  it('should return the previous business day for weekends and holidays', () => {
    expect(findDateOrPreviousDate(new Date('2020-02-24')).date).toStrictEqual(new Date('2020-02-21'));
    expect(findDateOrPreviousDate(new Date('2019-03-04')).date).toStrictEqual(new Date('2019-03-01'));
  });
});

describe('nextBusinessday', () => {
  it('should return the next business day', () => {
    expect(nextBusinessday(new Date('2020-02-17')).date).toStrictEqual(new Date('2020-02-18'));
    expect(nextBusinessday(new Date('2020-02-18')).date).toStrictEqual(new Date('2020-02-19'));
    expect(nextBusinessday(new Date('2020-02-19')).date).toStrictEqual(new Date('2020-02-20'));
    expect(nextBusinessday(new Date('2020-02-20')).date).toStrictEqual(new Date('2020-02-21'));
    expect(nextBusinessday(new Date('2020-02-21')).date).toStrictEqual(new Date('2020-02-26'));
    expect(nextBusinessday(new Date('2020-02-22')).date).toStrictEqual(new Date('2020-02-26'));
    expect(nextBusinessday(new Date('2020-02-23')).date).toStrictEqual(new Date('2020-02-26'));
    expect(nextBusinessday(new Date('2020-02-24')).date).toStrictEqual(new Date('2020-02-26'));
    expect(nextBusinessday(new Date('2020-02-25')).date).toStrictEqual(new Date('2020-02-26'));
    expect(nextBusinessday(new Date('2020-02-26')).date).toStrictEqual(new Date('2020-02-27'));
    expect(nextBusinessday(new Date('2020-02-27')).date).toStrictEqual(new Date('2020-02-28'));
    expect(nextBusinessday(new Date('2020-02-28')).date).toStrictEqual(new Date('2020-03-02'));
  });
});

describe('getPreviousBusinessDayRates', () => {
  it('should return the object with the taxes from the business day before the parameter', () => {
    const obj = getPreviousBusinessDayRates(new Date('2020-02-26'));
    expect(obj.date).toStrictEqual(new Date('2020-02-21'));
    expect(obj.selic.dailyRate()).toStrictEqual(1.00016137);
    expect(obj.selic.yearlyRate()).toStrictEqual(4.15);
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
  describe('getSelicForDate', () => {
    it('should return the historical rate for dates inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getSelicForDate(new Date('2010-03-29')).dailyRate()).toBe(1.00032927);
      expect(repo.getSelicForDate(new Date('2010-03-29')).yearlyRate()).toBe(8.65);
      expect(repo.getSelicForDate(new Date('2020-02-28')).dailyRate()).toBe(1.00016137);
      expect(repo.getSelicForDate(new Date('2020-02-28')).yearlyRate()).toBe(4.15);
      expect(repo.getSelicForDate(new Date('2020-04-09')).dailyRate()).toBe(1.00014227);
      expect(repo.getSelicForDate(new Date('2020-04-09')).yearlyRate()).toBe(3.65);
    });

    it('should return null for weekends and holidays inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getSelicForDate(new Date('2020-02-23'))).toBeNull();
      expect(repo.getSelicForDate(new Date('2019-03-04'))).toBeNull();
    });

    it('should return the default rate for dates after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        selic: {
          dailyRate: () => 4.42,
          yearlyRate: () => 10.42,
        },
      });
      expect(repo.getSelicForDate(new Date('2020-04-13')).dailyRate()).toBe(4.42);
      expect(repo.getSelicForDate(new Date('2020-04-13')).yearlyRate()).toBe(10.42);
      expect(repo.getSelicForDate(new Date('2055-03-04')).dailyRate()).toBe(4.42);
      expect(repo.getSelicForDate(new Date('2055-03-04')).yearlyRate()).toBe(10.42);
    });
    it('should return null for weekends and holidays after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        selic: {
          dailyRate: () => 4.42,
          yearlyRate: () => 10.42,
        },
      });
      expect(repo.getSelicForDate(new Date('2020-04-10'))).toBeNull();
      expect(repo.getSelicForDate(new Date('2055-03-06'))).toBeNull();
    });
  });

  describe('getSelicForPreviousBusinessDay', () => {
    it('should return the historical rate for dates inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getSelicForPreviousBusinessDay(new Date('2010-03-29')).dailyRate()).toBe(1.00032927);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2010-03-29')).yearlyRate()).toBe(8.65);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-02-28')).dailyRate()).toBe(1.00016137);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-02-28')).yearlyRate()).toBe(4.15);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-09')).dailyRate()).toBe(1.00014227);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-09')).yearlyRate()).toBe(3.65);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-13')).dailyRate()).toBe(1.00014227);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-13')).yearlyRate()).toBe(3.65);
    });

    it('should return the historical rate for weekends and holidays if the previous business day is inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues({
        selic: {
          dailyRate: () => 4.42,
          yearlyRate: () => 10.42,
        },
      });
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-02-23')).dailyRate()).toBe(1.00016137);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-02-23')).yearlyRate()).toBe(4.15);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-10')).dailyRate()).toBe(1.00014227);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-10')).yearlyRate()).toBe(3.65);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-11')).dailyRate()).toBe(1.00014227);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-11')).yearlyRate()).toBe(3.65);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-12')).dailyRate()).toBe(1.00014227);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-12')).yearlyRate()).toBe(3.65);
    });

    it('should return the default rate for dates after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        selic: {
          dailyRate: () => 4.42,
          yearlyRate: () => 10.42,
        },
      });
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-14')).dailyRate()).toBe(4.42);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-14')).yearlyRate()).toBe(10.42);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2055-03-04')).dailyRate()).toBe(4.42);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2055-03-04')).yearlyRate()).toBe(10.42);
    });
    it('should return the default rate for weekends and holidays if the previous business day is after the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues({
        selic: {
          dailyRate: () => 4.42,
          yearlyRate: () => 10.42,
        },
      });
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-18')).dailyRate()).toBe(4.42);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2020-04-18')).yearlyRate()).toBe(10.42);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2055-03-06')).dailyRate()).toBe(4.42);
      expect(repo.getSelicForPreviousBusinessDay(new Date('2055-03-06')).yearlyRate()).toBe(10.42);
    });
  });

  describe('getIPCAForDate', () => {
    it('should return the historical rate for dates inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getIPCAForDate(new Date('2019-11-01'))).toBeCloseTo(0.0051, 8);
      expect(repo.getIPCAForDate(new Date('2019-12-01'))).toBeCloseTo(0.0115, 8);
      expect(repo.getIPCAForDate(new Date('2020-02-01'))).toBeCloseTo(0.0025, 8);
      expect(repo.getIPCAForDate(new Date('2020-03-01'))).toBeCloseTo(0.0007, 8);
    });

    it('should return null for days without IPCA publication inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getIPCAForDate(new Date('2020-02-23'))).toBeNull();
      expect(repo.getIPCAForDate(new Date('2019-03-04'))).toBeNull();
      expect(repo.getIPCAForDate(new Date('2020-03-14'))).toBeNull();
      expect(repo.getIPCAForDate(new Date('2020-03-16'))).toBeNull();
    });

    it('should return the default rate for dates after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        ipca: 4.42,
      });
      expect(repo.getIPCAForDate(new Date('2020-05-01'))).toBe(4.42);
      expect(repo.getIPCAForDate(new Date('2020-06-01'))).toBe(4.42);
      expect(repo.getIPCAForDate(new Date('2055-03-01'))).toBe(4.42);

      expect(repo.getIPCAForDate(new Date('2020-08-01'))).toBe(4.42); // This should return null, since 15th is a saturday
    });
    it('should return null for weekends and holidays after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        ipca: 4.42,
      });
      expect(repo.getIPCAForDate(new Date('2020-06-10'))).toBeNull();
      expect(repo.getIPCAForDate(new Date('2055-03-06'))).toBeNull();

      expect(repo.getIPCAForDate(new Date('2020-08-14'))).toBeNull(); // TODO This should return 4.42, since 15th is a saturday
    });
  });

  describe('getProjectedIPCAForDate', () => {
    it('should return the historical rate for dates inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getProjectedIPCAForDate(new Date('2020-01-02'))).toBeCloseTo(0.0105, 5);
      expect(repo.getProjectedIPCAForDate(new Date('2020-01-03'))).toBeCloseTo(0.0105, 5);
      expect(repo.getProjectedIPCAForDate(new Date('2020-01-22'))).toBeCloseTo(0.0034, 5);
      expect(repo.getProjectedIPCAForDate(new Date('2020-04-28'))).toBeCloseTo(-0.0004, 5);
    });

    it('should return null for weekends and holidays inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getProjectedIPCAForDate(new Date('2020-01-11'))).toBeNull();
      expect(repo.getProjectedIPCAForDate(new Date('2020-02-23'))).toBeNull();
      expect(repo.getProjectedIPCAForDate(new Date('2020-02-24'))).toBeNull();
    });

    it('should return the default rate for dates after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        projectedIpca: 4.42,
      });
      expect(repo.getProjectedIPCAForDate(new Date('2020-04-29'))).toBe(4.42);
      expect(repo.getProjectedIPCAForDate(new Date('2020-06-15'))).toBe(4.42);
      expect(repo.getProjectedIPCAForDate(new Date('2055-03-15'))).toBe(4.42);
    });
    it('should return null for weekends and holidays after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        projectedIpca: 4.42,
      });
      expect(repo.getProjectedIPCAForDate(new Date('2020-06-14'))).toBeNull();
      expect(repo.getProjectedIPCAForDate(new Date('2055-03-06'))).toBeNull();
    });
  });

  describe('getTesouroTaxes', () => {
    it('should return the historical rate for dates inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-01-02')).buyTax).toBe(2.28);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-01-02')).sellTax).toBe(2.40);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-01-03')).sellTax).toBe(2.48);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-05-21')).buyTax).toBe(2.53);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-05-21')).sellTax).toBe(2.65);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-01-02')).buyTax).toBe(5.75);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-01-02')).sellTax).toBe(5.87);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-01-03')).sellTax).toBe(5.96);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-05-21')).buyTax).toBe(4.62);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-05-21')).sellTax).toBe(4.74);
      expect(repo.getTesouroTaxes('slic2025', new Date('2019-02-02')).buyTax).toBe(0.02);
      expect(repo.getTesouroTaxes('slic2025', new Date('2019-02-02')).sellTax).toBe(0.06);
      expect(repo.getTesouroTaxes('slic2025', new Date('2020-02-21')).sellTax).toBe(0.03);
      expect(repo.getTesouroTaxes('slic2025', new Date('2020-02-26')).sellTax).toBe(0.03);
      expect(repo.getTesouroTaxes('slic2025', new Date('2020-02-03')).sellTax).toBe(0.03);
      expect(repo.getTesouroTaxes('slic2025', new Date('2020-03-09')).sellTax).toBe(0.04);
      expect(repo.getTesouroTaxes('slic2025', new Date('2020-03-23')).sellTax).toBe(0.04);
    });

    it('should return the tax for the previous business day for weekends and holidays inside the period with historical dates', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-02-23')).buyTax).toBe(2.16);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-02-23')).buyTax).toBe(5.25);
      expect(repo.getTesouroTaxes('slic2025', new Date('2020-02-25')).buyTax).toBe(0.02);
    });

    it('should return the default rate for dates after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        ipca2024: {
          buyTax: 4.42,
          sellTax: 5.42,
        },
        pfix2023: {
          buyTax: 7.42,
          sellTax: 8.42,
        },
      });
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-05-22')).buyTax).toBe(4.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-05-22')).sellTax).toBe(5.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-06-15')).buyTax).toBe(4.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-06-15')).sellTax).toBe(5.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2055-03-15')).buyTax).toBe(4.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2055-03-15')).sellTax).toBe(5.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-05-22')).buyTax).toBe(7.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-05-22')).sellTax).toBe(8.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-06-15')).buyTax).toBe(7.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-06-15')).sellTax).toBe(8.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2055-03-15')).buyTax).toBe(7.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2055-03-15')).sellTax).toBe(8.42);
    });
    it('should return the default rate for weekends and holidays after the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues({
        ipca2024: {
          buyTax: 4.42,
          sellTax: 5.42,
        },
        pfix2023: {
          buyTax: 7.42,
          sellTax: 8.42,
        },
      });
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-06-10')).buyTax).toBe(4.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2020-06-10')).sellTax).toBe(5.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2055-03-06')).buyTax).toBe(4.42);
      expect(repo.getTesouroTaxes('ipca2024', new Date('2055-03-06')).sellTax).toBe(5.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-06-10')).buyTax).toBe(7.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2020-06-10')).sellTax).toBe(8.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2055-03-06')).buyTax).toBe(7.42);
      expect(repo.getTesouroTaxes('pfix2023', new Date('2055-03-06')).sellTax).toBe(8.42);
    });

    it('should throw an exception for an invalid tesouro id before the last date with historical data', () => {
      const repo = newRepositoryWithProjectedValues();
      expect(() => repo.getTesouroTaxes('ipca2021', new Date('2020-01-02'))).toThrow('Invalid tesouro id "ipca2021"');
    });
    it('should throw an exception after the last date with historical data if the tesouro id is not present in the default values', () => {
      const repo = newRepositoryWithProjectedValues({
        ipca2024: {
          buyTax: 4.42,
          sellTax: 5.42,
        },
      });
      expect(() => repo.getTesouroTaxes('pfix2023', new Date('2055-01-02'))).toThrow('tesouro id "pfix2023" not present on default values');
    });
  });
});
