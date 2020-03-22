import { newRate } from './interest-rates';
import {
  newDateGenerator,
  newInterestCalculator,
  newInterestCalculatorNominalValue,
  newCustodyFeeCalculator,
  newAdjusmentFactorCalculator,
  newValueAdjuster,
} from './investment-rules';

describe('newDateGenerator', () => {
  it('should return a function', () => {
    expect(newDateGenerator()).toBeInstanceOf(Function);
  });
  describe('should return a function that', () => {
    it('given an object with a date field, returns a clone of that object where the date is 1 day ahed the original date', () => {
      const dateGenerator = newDateGenerator();
      expect(dateGenerator({ date: new Date('2020-02-28') })).toStrictEqual({ date: new Date('2020-02-29') });
    });
  });
  describe('given a defaultDate, should return a function that', () => {
    const defaultDate = new Date('2019-07-01');
    const dateGenerator = newDateGenerator(defaultDate);

    it('given an object with a date field, returns a clone of that object where the date is 1 day ahed the original date', () => {
      expect(dateGenerator({ date: new Date('2020-02-28') })).toStrictEqual({ date: new Date('2020-02-29') });
    });
    it('given an object without a date field, returns a clone of that object where the date is equal to defaultDate', () => {
      expect(dateGenerator({ })).toStrictEqual({ date: defaultDate });
    });
  });
});

describe('newInterestCalculator', () => {
  it('should return a function', () => {
    expect(newInterestCalculator()).toBeInstanceOf(Function);
  });

  describe('given a rate, should return a function that', () => {
    it('accepts an object with a value and a date field, and returns a clone of that object where the value has interest accumulated according to the rate', () => {
      const interestCalculator = newInterestCalculator(0, newRate(0.01, 'day'));
      expect(interestCalculator({ date: new Date('2019-05-22'), value: 1000 })).toStrictEqual({ date: new Date('2019-05-22'), value: 1010 });
    });
    it('adds interest only on business days', () => {
      const interestCalculator = newInterestCalculator(0, newRate(0.01, 'day'));
      expect(interestCalculator({ date: new Date('2019-03-02'), value: 1000 })).toStrictEqual({ date: new Date('2019-03-02'), value: 1000 }); // Saturday
      expect(interestCalculator({ date: new Date('2019-03-03'), value: 1000 })).toStrictEqual({ date: new Date('2019-03-03'), value: 1000 }); // Sunday
      expect(interestCalculator({ date: new Date('2019-03-04'), value: 1000 })).toStrictEqual({ date: new Date('2019-03-04'), value: 1000 }); // Carnival holiday
    });
  });

  describe('given a rate and a defaultValue, should return a function that', () => {
    const defaultValue = 500;
    const interestCalculator = newInterestCalculator(defaultValue, newRate(0.01, 'day'));

    it('accepts an object with a value and a date field, and returns a clone of that object where the value has interest accumulated according to the rate', () => {
      expect(interestCalculator({ date: new Date('2019-05-22'), value: 1000 })).toStrictEqual({ date: new Date('2019-05-22'), value: 1010 });
    });
    it('given an object without a value field, returns a clone of that object where the value is equal to defaultValue', () => {
      expect(interestCalculator({ })).toStrictEqual({ value: defaultValue });
    });
  });
});

describe('newInterestCalculatorNominalValue', () => {
  it('should return a function', () => {
    expect(newInterestCalculatorNominalValue()).toBeInstanceOf(Function);
  });

  describe('given a rate, should return a function that', () => {
    it('accepts an object with a nominalValue and a date field, and returns a clone of that object where the nominalValue has interest accumulated according to the rate', () => {
      const interestCalculatorNominalValue = newInterestCalculatorNominalValue(0, newRate(0.01, 'day'));
      expect(interestCalculatorNominalValue({ date: new Date('2019-05-22'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-05-22'), nominalValue: 1010 });
    });
    it('adds interest only on business days', () => {
      const interestCalculatorNominalValue = newInterestCalculatorNominalValue(0, newRate(0.01, 'day'));
      expect(interestCalculatorNominalValue({ date: new Date('2019-03-02'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-03-02'), nominalValue: 1000 }); // Saturday
      expect(interestCalculatorNominalValue({ date: new Date('2019-03-03'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-03-03'), nominalValue: 1000 }); // Sunday
      expect(interestCalculatorNominalValue({ date: new Date('2019-03-04'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-03-04'), nominalValue: 1000 }); // Carnival holiday
    });
  });

  describe('given a rate and a defaultValue, should return a function that', () => {
    const defaultValue = 500;
    const interestCalculatorNominalValue = newInterestCalculatorNominalValue(defaultValue, newRate(0.01, 'day'));

    it('accepts an object with a nominalValue and a date field, and returns a clone of that object where the nominalValue has interest accumulated according to the rate', () => {
      expect(interestCalculatorNominalValue({ date: new Date('2019-05-22'), nominalValue: 1000 })).toStrictEqual({ date: new Date('2019-05-22'), nominalValue: 1010 });
    });
    it('given an object without a nominalValue field, returns a clone of that object where the nominalValue is equal to defaultValue', () => {
      expect(interestCalculatorNominalValue({ })).toStrictEqual({ nominalValue: defaultValue });
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
      expect(custodyFeeCalculator({ date: new Date('2019-03-04'), value: 100000 }).custodyFee).toBeCloseTo(0.69, 2);
    });
    it('should not generate a custody fee on the two first days of the investment', () => {
      expect(custodyFeeCalculator({ date: new Date('2019-03-01'), value: 10000 }).custodyFee).toBe(0);
      expect(custodyFeeCalculator({ date: new Date('2019-03-02'), value: 10000 }).custodyFee).toBe(0);
      expect(custodyFeeCalculator({ date: new Date('2019-03-03'), value: 10000 }).custodyFee).toBeCloseTo(0.07, 2);
      expect(custodyFeeCalculator({ date: new Date('2019-03-04'), value: 10000 }).custodyFee).toBeCloseTo(0.07, 2);
    });
    it('accepts an object without a value field, and returns a clone of that object with a new custodyFee field with a fee of 0', () => {
      expect(custodyFeeCalculator({ date: new Date('2019-03-04') }).custodyFee).toBe(0);
      expect(custodyFeeCalculator({ }).custodyFee).toBe(0);
    });
    it('accepts an object without a date field, and returns a clone of that object with a new custodyFee field with a fee of 0', () => {
      expect(custodyFeeCalculator({ value: 10 }).custodyFee).toBe(0);
    });
  });
});

describe('newAdjusmentFactorCalculator', () => {
  it('should return a function', () => {
    expect(newAdjusmentFactorCalculator()).toBeInstanceOf(Function);
  });

  describe('when called with an adjustmentRate and endDate, should return a function that', () => {
    const adjusmentFactorCalculator = newAdjusmentFactorCalculator(-0.0002, new Date('2014-03-07'));

    it('accepts an object with a current date field, and returns a clone of that object with a new adjustmentFactor field with a multiplication factor adjusted to the number of days remaining in the investment', () => {
      expect(adjusmentFactorCalculator({ date: new Date('2008-05-21') }).adjustmentFactor).toBe(1.001158);

      const adjusmentFactorCalculator2 = newAdjusmentFactorCalculator(0.0002, new Date('2025-02-26'));
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

    it('accepts an object with a nominalValue and a adjustmentFactor fields, and returns a clone of that object with a new the field value containing the nominalValue adjusted with the adjustmentFactor', () => {
      expect(valueAdjuster({ adjustmentFactor: 0.9, nominalValue: 0 }).value).toBe(0);
      expect(valueAdjuster({ adjustmentFactor: 0.95, nominalValue: 10 }).value).toBeCloseTo(9.5, 2);
      expect(valueAdjuster({ adjustmentFactor: 2, nominalValue: 123.45 }).value)
        .toBeCloseTo(246.9, 2);
      expect(valueAdjuster({ adjustmentFactor: 1, nominalValue: 100 }).value).toBe(100);
    });

    it('accepts an object without a value field, and returns a clone of that object with an empty value', () => {
      expect(valueAdjuster({ }).value).toBeUndefined();
      expect(valueAdjuster({ nominalValue: null }).value).toBeNull();
    });

    it('accepts an object without a adjustmentFactor field, and returns a clone of that object with an the same value', () => {
      expect(valueAdjuster({ nominalValue: 10 }).value).toBe(10);
    });
  });
});
