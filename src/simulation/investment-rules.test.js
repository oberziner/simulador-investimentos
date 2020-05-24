import { newRate } from './interest-rates';
import { newRepositoryWithProjectedValues } from '../repositories/dates-and-taxes';
import {
  newDateGenerator,
  newInterestCalculator,
  newInterestCalculatorNominalValue,
  newInflationCalculatorNominalValue,
  newCustodyFeeCalculator,
  newAdjusmentFactorCalculator,
  newValueAdjuster,
} from './investment-rules';

describe('newDateGenerator', () => {
  it('should return a function', () => {
    expect(newDateGenerator()).toBeInstanceOf(Function);
  });
  describe('should return a function that', () => {
    it('given an object with a date field, returns a clone of that object where the date is 1 day ahead the original date', () => {
      const dateGenerator = newDateGenerator();
      expect(dateGenerator({ date: new Date('2020-02-28') })).toStrictEqual({ date: new Date('2020-02-29') });
    });
  });
  describe('given a defaultDate, should return a function that', () => {
    const defaultDate = new Date('2019-07-01');
    const dateGenerator = newDateGenerator(defaultDate);

    it('given an object with a date field, returns a clone of that object where the date is 1 day ahead the original date', () => {
      expect(dateGenerator({ date: new Date('2020-02-28') })).toStrictEqual({ date: new Date('2020-02-29') });
    });
    it('given an object without a date field, returns a clone of that object where the date is equal to defaultDate', () => {
      expect(dateGenerator({ })).toStrictEqual({ date: defaultDate });
    });
  });
});

describe('newInterestCalculator', () => {
  const ratesRepository = ({ getDailyRate: () => 1.01 });

  it('should return a function', () => {
    expect(newInterestCalculator()).toBeInstanceOf(Function);
  });

  describe('given a rates repository, should return a function that', () => {
    it('accepts an object with a value and a date field, and returns a clone of that object where the value has interest accumulated according to the rate', () => {
      const interestCalculator = newInterestCalculator(0, ratesRepository);
      expect(interestCalculator({ date: new Date('2019-05-22'), value: 1000 })).toStrictEqual({
        date: new Date('2019-05-22'),
        usedRate: 1.01,
        value: 1010,
      });
    });
    it('adds interest only on business days', () => {
      const interestCalculator = newInterestCalculator(0, ratesRepository);
      expect(interestCalculator({ date: new Date('2019-03-02'), value: 1000 })).toStrictEqual({ date: new Date('2019-03-02'), value: 1000 }); // Saturday
      expect(interestCalculator({ date: new Date('2019-03-03'), value: 1000 })).toStrictEqual({ date: new Date('2019-03-03'), value: 1000 }); // Sunday
      expect(interestCalculator({ date: new Date('2019-03-04'), value: 1000 })).toStrictEqual({ date: new Date('2019-03-04'), value: 1000 }); // Carnival holiday
    });
  });

  describe('given a rate and a defaultValue, should return a function that', () => {
    const defaultValue = 500;
    const interestCalculator = newInterestCalculator(defaultValue, ratesRepository);

    it('accepts an object with a value and a date field, and returns a clone of that object where the value has interest accumulated according to the rate', () => {
      expect(interestCalculator({ date: new Date('2019-05-22'), value: 1000 })).toStrictEqual({
        date: new Date('2019-05-22'),
        usedRate: 1.01,
        value: 1010,
      });
    });
    it('given an object without a value field, returns a clone of that object where the value is equal to defaultValue', () => {
      expect(interestCalculator({ })).toStrictEqual({ value: defaultValue });
    });
  });
});

describe('newInterestCalculatorNominalValue', () => {
  const ratesRepository = ({ getSelicForPreviousBusinessDay: () => ({ dailyRate: () => 1.01 }) });

  it('should return a function', () => {
    expect(newInterestCalculatorNominalValue()).toBeInstanceOf(Function);
  });

  describe('given a rate, should return a function that', () => {
    it('accepts an object with a nominalValue and a date field, and returns a clone of that object where the nominalValue has interest accumulated according to the rate', () => {
      const interestCalculatorNominalValue = newInterestCalculatorNominalValue(0, ratesRepository);
      expect(interestCalculatorNominalValue({ date: new Date('2019-05-22'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-05-22'), nominalValue: 1010 });
    });
    it('adds interest only on business days', () => {
      const interestCalculatorNominalValue = newInterestCalculatorNominalValue(0, ratesRepository);
      expect(interestCalculatorNominalValue({ date: new Date('2019-03-02'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-03-02'), nominalValue: 1000 }); // Saturday
      expect(interestCalculatorNominalValue({ date: new Date('2019-03-03'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-03-03'), nominalValue: 1000 }); // Sunday
      expect(interestCalculatorNominalValue({ date: new Date('2019-03-04'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-03-04'), nominalValue: 1000 }); // Carnival holiday
    });
  });

  describe('given a rate and a defaultValue, should return a function that', () => {
    const defaultValue = 500;
    const interestCalculatorNominalValue = newInterestCalculatorNominalValue(
      defaultValue, ratesRepository,
    );

    it('accepts an object with a nominalValue and a date field, and returns a clone of that object where the nominalValue has interest accumulated according to the rate', () => {
      expect(interestCalculatorNominalValue({ date: new Date('2019-05-22'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-05-22'), nominalValue: 1010 });
    });
    it('given an object without a nominalValue field, returns a clone of that object where the nominalValue is equal to defaultValue', () => {
      expect(interestCalculatorNominalValue({ })).toStrictEqual({ nominalValue: defaultValue });
    });
  });
});

describe('newInflationCalculatorNominalValue', () => {
  const repo = newRepositoryWithProjectedValues();
  const ratesRepository = ({ getIPCAForDate: repo.getIPCAForDate });

  it('should return a function', () => {
    expect(newInflationCalculatorNominalValue()).toBeInstanceOf(Function);
  });

  describe('given a rate, should return a function that accepts an object with a nominalValue and a date field and', () => {
    it('returns a clone of that object where the nominalValue is adjusted by the inflation when the the next business day is the 15th or the first business day after the 15th', () => {
      const inflationCalculatorNominalValue = newInflationCalculatorNominalValue(
        0, ratesRepository,
      );
      expect(inflationCalculatorNominalValue({ date: new Date('2019-02-15'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2019-02-15'), nominalValue: 10032 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-01-15'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-01-15'), nominalValue: 10115 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-02-14'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-02-14'), nominalValue: 10021 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-03-13'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-03-13'), nominalValue: 10025 });
    });

    it('returns a clone of that object where the nominalValue is not changed', () => {
      const inflationCalculatorNominalValue = newInflationCalculatorNominalValue(
        0, ratesRepository,
      );
      expect(inflationCalculatorNominalValue({ date: new Date('2019-02-14'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2019-02-14'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2019-02-16'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2019-02-16'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2019-02-17'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2019-02-17'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2019-02-18'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2019-02-18'), nominalValue: 10000 });


      expect(inflationCalculatorNominalValue({ date: new Date('2020-01-14'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-01-14'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-01-16'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-01-16'), nominalValue: 10000 });

      expect(inflationCalculatorNominalValue({ date: new Date('2020-02-13'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-02-13'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-02-15'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-02-15'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-02-16'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-02-16'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-02-17'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-02-17'), nominalValue: 10000 });

      expect(inflationCalculatorNominalValue({ date: new Date('2020-03-12'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-03-12'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-03-14'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-03-14'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-03-15'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-03-15'), nominalValue: 10000 });
      expect(inflationCalculatorNominalValue({ date: new Date('2020-03-16'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-03-16'), nominalValue: 10000 });
    });
  });

  describe('given a rate and a defaultValue, should return a function that', () => {
    const defaultValue = 500;
    const inflationCalculatorNominalValue = newInflationCalculatorNominalValue(
      defaultValue, ratesRepository,
    );

    it('accepts an object with a nominalValue and a date field, and returns a clone of that object where the nominalValue has interest accumulated according to the rate', () => {
      expect(inflationCalculatorNominalValue({ date: new Date('2020-01-15'), nominalValue: 10000 })).toStrictEqual({ date: new Date('2020-01-15'), nominalValue: 10115 });
    });
    it('given an object without a nominalValue field, returns a clone of that object where the nominalValue is equal to defaultValue', () => {
      expect(inflationCalculatorNominalValue({ })).toStrictEqual({ nominalValue: defaultValue });
    });
  });
});

describe('newCustodyFeeCalculator', () => {
  it('should return a function', () => {
    expect(newCustodyFeeCalculator()).toBeInstanceOf(Function);
  });

  describe('when called with a rate, should return a function that', () => {
    const custodyFeeCalculator = newCustodyFeeCalculator(new Date('2019-03-01'), newRate(0.0025, 'year364'));

    it('accepts an object with a value field, and returns a clone of that object with a new custodyFee field with a fee of calculated for that day with the given rate', () => {
      expect(custodyFeeCalculator({ date: new Date('2019-03-04'), value: 0 }).custodyFee).toBe(0);
      expect(custodyFeeCalculator({ date: new Date('2019-03-04'), value: 10000 }).custodyFee).toBeCloseTo(0.07, 2);
      expect(custodyFeeCalculator({ date: new Date('2019-03-03'), value: 10000 }).custodyFee).toBeCloseTo(0.07, 2);
      expect(custodyFeeCalculator({ date: new Date('2019-03-04'), value: 100000 }).custodyFee).toBeCloseTo(0.69, 2);
    });
    it('should not generate a custody fee on the two first days of the investment', () => {
      expect(custodyFeeCalculator({ date: new Date('2019-03-01'), value: 10000 }).custodyFee).toBe(0);
      expect(custodyFeeCalculator({ date: new Date('2019-03-02'), value: 10000 }).custodyFee).toBe(0);
    });
    it('accepts an object without a value field, and returns a clone of that object with a new custodyFee field with a fee of 0', () => {
      expect(custodyFeeCalculator({ date: new Date('2019-03-04') }).custodyFee).toBe(0);
      expect(custodyFeeCalculator({ date: new Date('2019-03-04') }).totalCustodyFee).toBe(0);
    });
  });
});

describe('newAdjusmentFactorCalculator', () => {
  it('should return a function', () => {
    expect(newAdjusmentFactorCalculator()).toBeInstanceOf(Function);
  });

  describe('when called with an adjustmentRate repository and endDate, should return a function that', () => {
    it('accepts an object with a current date field, and returns a clone of that object with a new adjustmentFactor field with a multiplication factor adjusted to the number of days remaining in the investment', () => {
      const ratesRepository = ({ getAdjustmentRate: () => -0.0002 });
      const adjusmentFactorCalculator = newAdjusmentFactorCalculator(new Date('2014-03-07'), ratesRepository);
      expect(adjusmentFactorCalculator({ date: new Date('2008-05-21') }).adjustmentFactor).toBe(1.001157);

      const ratesRepository2 = ({ getAdjustmentRate: () => 0.0002 });
      const adjusmentFactorCalculator2 = newAdjusmentFactorCalculator(new Date('2025-02-26'), ratesRepository2);
      expect(adjusmentFactorCalculator2({ date: new Date('2020-02-18') }).adjustmentFactor).toBe(0.998999);
    });
  });
});

describe('newValueAdjuster', () => {
  it('should return a function', () => {
    expect(newValueAdjuster()).toBeInstanceOf(Function);
  });

  describe('when called, should return a function that', () => {
    const valueAdjuster = newValueAdjuster();

    it('accepts an object with a projectedNominalValue and a adjustmentFactor fields, and returns a clone of that object with a new the field value containing the projectedNominalValue adjusted with the adjustmentFactor', () => {
      expect(valueAdjuster({ adjustmentFactor: 0.9, projectedNominalValue: 0 }).value).toBe(0);
      expect(valueAdjuster({ adjustmentFactor: 0.95, projectedNominalValue: 10 }).value)
        .toBeCloseTo(9.5, 2);
      expect(valueAdjuster({ adjustmentFactor: 2, projectedNominalValue: 123.45 }).value)
        .toBeCloseTo(246.9, 2);
      expect(valueAdjuster({ adjustmentFactor: 1, projectedNominalValue: 100 }).value).toBe(100);
    });

    it('accepts an object without a value field, and returns a clone of that object with an empty value', () => {
      expect(valueAdjuster({ }).value).toBeUndefined();
      expect(valueAdjuster({ projectedNominalValue: null }).value).toBeNull();
    });

    it('accepts an object without a adjustmentFactor field, and returns a clone of that object with an the same value', () => {
      expect(valueAdjuster({ projectedNominalValue: 10 }).value).toBe(10);
    });
  });
});
