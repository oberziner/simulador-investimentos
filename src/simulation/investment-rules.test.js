import { newRate } from './interest-rates';
import {
  newDateGenerator,
  newInterestCalculator,
  newCustodyFeeCalculator,
  newElapsedDaysCalculator,
} from './investment-rules';

describe('newDateGenerator', () => {
  it('should return a function', () => {
    expect(newDateGenerator()).toBeInstanceOf(Function);
  });
  describe('should return a function that', () => {
    it('given an object with a date field, returns a clone of that object where the date is 1 day ahed the original date', () => {
      const dateGenerator = newDateGenerator();
      expect(dateGenerator({ date: '2020-02-28' })).toStrictEqual({ date: new Date('2020-02-29') });
    });
  });
  describe('given a defaultDate, should return a function that', () => {
    const defaultDate = new Date('2019-07-01');
    const dateGenerator = newDateGenerator(defaultDate);

    it('given an object with a date field, returns a clone of that object where the date is 1 day ahed the original date', () => {
      expect(dateGenerator({ date: '2020-02-28' })).toStrictEqual({ date: new Date('2020-02-29') });
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

describe('newCustodyFeeCalculator', () => {
  it('should return a function', () => {
    expect(newCustodyFeeCalculator()).toBeInstanceOf(Function);
  });

  describe('when called with a rate, should return a function that', () => {
    const custodyFeeCalculator = newCustodyFeeCalculator(newRate(0.0025, 'year364'));

    it('accepts an object with a value field, and returns a clone of that object with a new custodyFee field with a fee of calculated for that day with the given rate', () => {
      expect(custodyFeeCalculator({ value: 0 }).custodyFee).toBe(0);
      expect(custodyFeeCalculator({ value: 10000 }).custodyFee).toBeCloseTo(0.07, 2);
      expect(custodyFeeCalculator({ value: 100000 }).custodyFee).toBeCloseTo(0.69, 2);
    });
    it('accepts an object without a value field, and returns a clone of that object with a new custodyFee field with a fee of 0', () => {
      expect(custodyFeeCalculator({ }).custodyFee).toBe(0);
    });
  });
});


describe('elapsedDaysCalculator', () => {
  it('should return a function', () => {
    expect(newElapsedDaysCalculator()).toBeInstanceOf(Function);
  });

  describe('should return a function that', () => {
    it('accepts an object without an elapsedDays field, and returns a clone of that object with a new elapsedDays field initialized with 0', () => {
      const elapsedDaysCalculator = newElapsedDaysCalculator();
      expect(elapsedDaysCalculator({})).toStrictEqual({ elapsedDays: 0 });
    });
    it('accepts an object with an elapsedDays field, and returns a clone of that object with elapsedDays incremented by 1', () => {
      const elapsedDaysCalculator = newElapsedDaysCalculator();
      expect(elapsedDaysCalculator({ elapsedDays: 0 })).toStrictEqual({ elapsedDays: 1 });
      expect(elapsedDaysCalculator({ elapsedDays: 4 })).toStrictEqual({ elapsedDays: 5 });
    });
  });
});
