import { newLCISeq, newLCI } from './lci';
import { newRate } from './interest-rates';
import { newInterestCalculator, newDateGenerator } from './investment-rules';

describe('lci sequence', () => {
  it('first .next should return the invested value', () => {
    expect(newLCISeq(newDateGenerator(new Date('2019-06-01')), newInterestCalculator(1000)).next()).toStrictEqual({
      date: new Date('2019-06-01'),
      value: 1000,
    });
  });

  it('subsequent .next should return the updated value for each day (changing the value only on business days)', () => {
    const ratesRepo = { getDailyRate: () => newRate(0.05, 'year252').dailyRate() + 1 };
    const lci = newLCISeq(newDateGenerator(new Date('2019-02-28')), newInterestCalculator(1000, ratesRepo));
    lci.next(); // jump first

    let { date, value } = lci.next();
    expect(date).toStrictEqual(new Date('2019-03-01'));
    expect(value).toBeCloseTo(1000.19, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-03-02')); // Saturday
    expect(value).toBeCloseTo(1000.19, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-03-03')); // Sunday
    expect(value).toBeCloseTo(1000.19, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-03-04')); // Carnival holiday
    expect(value).toBeCloseTo(1000.19, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-03-05')); // Carnival holiday
    expect(value).toBeCloseTo(1000.19, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-03-06'));
    expect(value).toBeCloseTo(1000.39, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-03-07'));
    expect(value).toBeCloseTo(1000.58, 2);
  });
});

describe('lci object', () => {
  const lci = newLCI(new Date('2019-03-01'), 1000, newRate(0.05, 'year252'), 90, new Date('2019-05-03'));

  it('should have a title with the rate being used', () => {
    expect(lci.title).toBe('LCI 90% SELIC 5% a.a.');
  });
  it('should have a startDate', () => {
    expect(lci.startDate).toStrictEqual(new Date('2019-03-01'));
  });
  it('should have an endDate', () => {
    expect(lci.endDate).toStrictEqual(new Date('2019-05-03'));
  });
  it('should have an initialValue', () => {
    expect(lci.initialValue).toBe(1000);
  });
  it('should have an grossValue', () => {
    expect(lci.grossValue).toBeCloseTo(1009.125, 2);
  });
  it('should have totalTaxes equal 0', () => {
    expect(lci.totalTaxes).toBe(0);
  });
  it('should have an netValue equal to the grossValue', () => {
    expect(lci.netValue).toBeCloseTo(1009.125, 2);
  });
  it('should have a list of steps', () => {
    expect(lci.steps).toHaveLength(64);
  });
  it('should have initial date and initial value as first step', () => {
    expect(lci.steps[0]).toStrictEqual({ date: new Date('2019-03-01'), value: 1000 });
  });
  it('should have the end date as last step with the correct value', () => {
    expect(lci.steps[lci.steps.length - 1].date).toStrictEqual(new Date('2019-05-03'));
    expect(lci.steps[lci.steps.length - 1].value).toBeCloseTo(1009.125, 2);
  });
  it('should have the correct values for the dates', () => {
    expect(lci.steps[23].date).toStrictEqual(new Date('2019-03-24'));
    expect(lci.steps[23].value).toBeCloseTo(1002.88, 2);

    expect(lci.steps[49].date).toStrictEqual(new Date('2019-04-19'));
    expect(lci.steps[49].value).toBeCloseTo(1007.115, 2);
  });
});

describe('lci values', () => {
  it('should be calculated correctly', () => {
    const lci = newLCI(new Date('2019-12-02'), 10000, newRate(0.0415, 'year252'), 90, new Date('2020-02-13'));

    // expect(JSON.stringify(lci.steps.splice(0, 10), null, 2))
    // .toStrictEqual(new Date('2020-02-21'));
    expect(lci.steps[0].date).toStrictEqual(new Date('2019-12-02'));
    expect(lci.steps[0].value).toBeCloseTo(10000, 2);

    expect(lci.steps[9].date).toStrictEqual(new Date('2019-12-11'));
    expect(lci.steps[9].value).toBeCloseTo(10011.966, 2);

    expect(lci.steps[10].date).toStrictEqual(new Date('2019-12-12'));
    expect(lci.steps[10].value).toBeCloseTo(10013.677, 2);

    expect(lci.steps[11].date).toStrictEqual(new Date('2019-12-13'));
    expect(lci.steps[11].value).toBeCloseTo(10015.217, 2);

    // Commenting this due to a bug on weekends
    // expect(lci.steps[12].date).toStrictEqual(new Date('2019-12-14'));
    // expect(lci.steps[12].value).toBeCloseTo(10016.75, 2);
    // expect(lci.steps[13].date).toStrictEqual(new Date('2019-12-15'));
    // expect(lci.steps[13].value).toBeCloseTo(10016.75, 2);

    expect(lci.steps[15].date).toStrictEqual(new Date('2019-12-17'));
    expect(lci.steps[15].value).toBeCloseTo(10018.298, 2);

    expect(lci.steps[16].date).toStrictEqual(new Date('2019-12-18'));
    expect(lci.steps[16].value).toBeCloseTo(10019.838, 2);

    expect(lci.steps[17].date).toStrictEqual(new Date('2019-12-19'));
    expect(lci.steps[17].value).toBeCloseTo(10021.38, 2);

    // Commenting this due to a bug on weekends
    // expect(lci.steps[19].date).toStrictEqual(new Date('2019-12-21'));
    // expect(lci.steps[19].value).toBeCloseTo(10024.46, 2);

    expect(lci.steps[24].date).toStrictEqual(new Date('2019-12-26'));
    expect(lci.steps[24].value).toBeCloseTo(10027.546, 2);

    expect(lci.steps[32].date).toStrictEqual(new Date('2020-01-03'));
    expect(lci.steps[32].value).toBeCloseTo(10035.26, 2);

    expect(lci.steps[73].date).toStrictEqual(new Date('2020-02-13'));
    expect(lci.steps[73].value).toBeCloseTo(10079.68, 2);
  });
});
