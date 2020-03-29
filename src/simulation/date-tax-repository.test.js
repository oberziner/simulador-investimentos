import { indexOfDate, findDate } from './date-tax-repository';

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

describe('findDate', () => {
  it('should return the object with the taxes for a given date', () => {
    expect(findDate(new Date('2020-02-26'))).toStrictEqual({
      date:"2020-02-26",
      yearlySelic:"4.15",
      dailySelic:"1.00016137"
    });
  });
  it('should return null for weekends and holidays', () => {
    expect(findDate(new Date('2020-02-23'))).toBe(null);
    expect(findDate(new Date('2019-03-04'))).toBe(null);
  });
});
