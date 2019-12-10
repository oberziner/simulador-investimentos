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
    it('should convert daily rate to yearly rate', () => {
      expect(newRate(0.01, 'day').yearlyRate()).toBeCloseTo(11.274002, 6);
    });
  });

  describe('created with monthly rate', () => {
    it('should convert monthly rate to daily rate', () => {
      expect(newRate(0.01, 'month').dailyRate()).toBeCloseTo(0.0003317, 6);
    });
    it('should return monthly correctly', () => {
      expect(newRate(0.01, 'month').monthlyRate()).toBeCloseTo(0.01, 6);
    });
    it('should convert monthly rate to yearly rate', () => {
      expect(newRate(0.01, 'month').yearlyRate()).toBeCloseTo(0.126825, 6);
    });
  });

  describe('created with yearly rate', () => {
    it('should convert yearly rate to dailyRate rate', () => {
      expect(newRate(0.01, 'year').dailyRate()).toBeCloseTo(0.0000395, 7);
    });
    it('should convert yearly rate to monthly rate', () => {
      expect(newRate(0.01, 'year').monthlyRate()).toBeCloseTo(0.0008295, 7);
    });
    it('should return yearly correctly', () => {
      expect(newRate(0.01, 'year').yearlyRate()).toBeCloseTo(0.01, 6);
    });
  });
});
