import { newRate } from './interest-rates';

describe('newRate', () => {
  it('should return a rate object', () => {
    expect.hasAssertions();
    const rate = newRate(1, 'month');
    expect(rate.rate).toBe(1);
    expect(rate.period).toBe('month');
  });
  it('should throw an exception if period is invalid', () => {
    expect.hasAssertions();
    expect(() => newRate(1, 2)).toThrow('Invalid period "2"');
  });
});

describe('rate object', () => {
  describe('created with daily rate', () => {
    it('should return daily rate correctly', () => {
      expect(newRate(0.01, 'day').dailyRate()).toBeCloseTo(0.01, 6);
    });
    it('should convert daily rate to monthly rate', () => {
      expect(newRate(0.01, 'day').monthlyRate()).toBeCloseTo(0.347849, 6);
    });
    it('should convert daily rate to yearly252 rate', () => {
      expect(newRate(0.01, 'day').yearly252Rate()).toBeCloseTo(11.274002, 6);
    });
    it('should convert daily rate to yearly364 rate', () => {
      expect(newRate(0.01, 'day').yearly364Rate()).toBeCloseTo(36.409341, 6);
    });
  });

  describe('created with monthly rate', () => {
    it('should convert monthly rate to daily rate', () => {
      expect(newRate(0.01, 'month').dailyRate()).toBeCloseTo(0.0003317, 6);
    });
    it('should return monthly correctly', () => {
      expect(newRate(0.01, 'month').monthlyRate()).toBeCloseTo(0.01, 6);
    });
    it('should convert monthly rate to yearly252 rate', () => {
      expect(newRate(0.01, 'month').yearly252Rate()).toBeCloseTo(0.126825, 6);
    });
    it('should convert monthly rate to yearly364 rate', () => {
      expect(newRate(0.01, 'month').yearly364Rate()).toBeCloseTo(0.126825, 6);
    });
  });

  describe('created with yearly252 rate', () => {
    it('should convert yearly252 rate to dailyRate rate', () => {
      expect(newRate(0.01, 'year252').dailyRate()).toBeCloseTo(0.0000395, 7);
    });
    it('should convert yearly252 rate to monthly rate', () => {
      expect(newRate(0.01, 'year252').monthlyRate()).toBeCloseTo(0.0008295, 7);
    });
    it('should return yearly252 correctly', () => {
      expect(newRate(0.01, 'year252').yearly252Rate()).toBeCloseTo(0.01, 6);
    });
    it('should throw and error on yearly364', () => {
      expect(() => newRate(0.01, 'year252').yearly364Rate()).toThrow('Cannot convert year252 rate to year364 rate');
    });
  });

  describe('created with yearly364 rate', () => {
    it('should convert yearly364 rate to dailyRate rate', () => {
      expect(newRate(0.01, 'year364').dailyRate()).toBeCloseTo(0.0000273, 7);
    });
    it('should convert yearly364 rate to monthly rate', () => {
      expect(newRate(0.01, 'year364').monthlyRate()).toBeCloseTo(0.0008295, 7);
    });
    it('should return yearly364 correctly', () => {
      expect(newRate(0.01, 'year364').yearly364Rate()).toBeCloseTo(0.01, 6);
    });
    it('should throw and error on yearly252', () => {
      expect(() => newRate(0.01, 'year364').yearly252Rate()).toThrow('Cannot convert year364 rate to year252 rate');
    });
  });

  it('.toString should return a text description of the rate', () => {
    expect(newRate(0.00021, 'day').toString()).toBe('0.021% a.d.');
    expect(newRate(0.1, 'month').toString()).toBe('10% a.m.');
    expect(newRate(0.013, 'year252').toString()).toBe('1.3% a.a.');
    expect(newRate(0.01, 'year364').toString()).toBe('1% a.a.');
    expect(newRate(0.025, 'year364').toString()).toBe('2.5% a.a.');
  });
});
