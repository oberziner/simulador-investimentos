import { newCDB } from './cdb';
import { newRate } from './interest-rates';

describe('cdb object', () => {
  const cdb = newCDB(new Date('2019-03-01'), 1000, newRate(0.05, 'year252'), 90, new Date('2019-05-03'));

  it('should have a title with the rate being used', () => {
    expect(cdb.title).toBe('CDB 90% SELIC 5% a.a.');
  });
  it('should have a startDate', () => {
    expect(cdb.startDate).toStrictEqual(new Date('2019-03-01'));
  });
  it('should have an endDate', () => {
    expect(cdb.endDate).toStrictEqual(new Date('2019-05-03'));
  });
  it('should have an initialValue', () => {
    expect(cdb.initialValue).toBe(1000);
  });
  it('should have an grossValue', () => {
    expect(cdb.grossValue).toBeCloseTo(1008.90, 2);
  });
  it('should have an netValue equal to the grossValue minus taxes', () => {
    expect(cdb.netValue).toBeCloseTo(1006.90, 2);
  });
  it('should have a list of steps', () => {
    expect(cdb.steps).toHaveLength(63);
  });
  it('should have initial date and initial value as first step', () => {
    expect(cdb.steps[0]).toStrictEqual({ date: new Date('2019-03-01'), value: 1000 });
  });
  it('should have the day before the end date as last step with the correct value', () => {
    expect(cdb.steps[cdb.steps.length - 1].date).toStrictEqual(new Date('2019-05-02'));
    expect(cdb.steps[cdb.steps.length - 1].value).toBeCloseTo(1008.90, 2);
  });
  it('should have the correct values for the dates', () => {
    expect(cdb.steps[23].date).toStrictEqual(new Date('2019-03-24'));
    expect(cdb.steps[23].value).toBeCloseTo(1002.88, 2);

    expect(cdb.steps[49].date).toStrictEqual(new Date('2019-04-19'));
    expect(cdb.steps[49].value).toBeCloseTo(1007.11, 2);
  });
  it('.totalDays should return the number of days between the initial date and the end date', () => {
    expect(cdb.totalDays).toBe(62);
  });
  it('.totalTaxes should return ammount of taxes to be charged', () => {
    expect(cdb.totalTaxes).toBeCloseTo(2.00, 2);
  });
});

describe('cdb object taxes', () => {
  it('should be charged not counting the start and end days', () => {
    let cdb = newCDB(new Date('2019-04-03'), 10000, newRate(0.05, 'year252'), 100, new Date('2019-10-01'));
    expect(cdb.totalDays).toBe(180);
    expect(cdb.totalTaxes).toBeCloseTo(68.10, 2);

    cdb = newCDB(new Date('2019-04-03'), 10000, newRate(0.05, 'year252'), 100, new Date('2019-10-02'));
    expect(cdb.totalDays).toBe(181);
    expect(cdb.totalTaxes).toBeCloseTo(60.96, 2);
  });
});
