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
    const lci = newLCISeq(newDateGenerator(new Date('2019-02-28')), newInterestCalculator(1000, newRate(0.05, 'year252')));
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
  const lci = newLCI(new Date('2019-03-01'), 1000, newRate(0.05, 'year252'), new Date('2019-05-03'));

  it('should have a title with the rate being used', () => {
    expect(lci.title).toBe('LCI 5% a.a.');
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
  it('should have a list of steps', () => {
    expect(lci.steps).toHaveLength(63);
  });
  it('should have initial date and initial value as first step', () => {
    expect(lci.steps[0]).toStrictEqual({ date: new Date('2019-03-01'), value: 1000 });
  });
  it('should have the day before the end date as last step with the correct value', () => {
    expect(lci.steps[lci.steps.length - 1].date).toStrictEqual(new Date('2019-05-02'));
    expect(lci.steps[lci.steps.length - 1].value).toBeCloseTo(1007.77, 2);
  });
  it('should have the correct values for the dates', () => {
    expect(lci.steps[23].date).toStrictEqual(new Date('2019-03-24'));
    expect(lci.steps[23].value).toBeCloseTo(1002.52, 2);

    expect(lci.steps[49].date).toStrictEqual(new Date('2019-04-19'));
    expect(lci.steps[49].value).toBeCloseTo(1006.21, 2);
  });
});
