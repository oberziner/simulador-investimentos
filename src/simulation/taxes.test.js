import { calculateIncomeTax } from './taxes';

describe('calculateIncomeTax', () => {
  it('should return 22.5% for investments shorter than 180 days', () => {
    expect(calculateIncomeTax(1000, 1)).toBe(225);
    expect(calculateIncomeTax(1000, 180)).toBe(225);
  });
  it('should return 20% for investments between 181 and 360 days', () => {
    expect(calculateIncomeTax(1000, 181)).toBe(200);
    expect(calculateIncomeTax(1000, 360)).toBe(200);
  });
  it('should return 17.5% for investments between 361 and 720 days', () => {
    expect(calculateIncomeTax(1000, 361)).toBe(175);
    expect(calculateIncomeTax(1000, 720)).toBe(175);
  });
  it('should return 15% for investments over 720 days', () => {
    expect(calculateIncomeTax(1000, 721)).toBe(150);
    expect(calculateIncomeTax(1000, 1000)).toBe(150);
    expect(calculateIncomeTax(1000, 99999)).toBe(150);
  });
});
