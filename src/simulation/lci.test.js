import { newLCISeq, newLCI } from './lci';
import { newRate } from './interest-rates';

describe('lci sequence', () => {
  it('first .next should return the invested value', () => {
    expect(newLCISeq(new Date('2019-06-01'), 1000).next()).toStrictEqual({
      date: new Date('2019-06-01'),
      value: 1000,
    });
  });

  it('subsequent .next should return the updated value for each day', () => {
    const lci = newLCISeq(new Date('2019-07-01'), 1000, newRate(0.05, 'year'));
    lci.next(); // jump first
    let { date, value } = lci.next();
    expect(date).toStrictEqual(new Date('2019-07-02'));
    expect(value).toBeCloseTo(1000.19, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-07-03'));
    expect(value).toBeCloseTo(1000.39, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-07-04'));
    expect(value).toBeCloseTo(1000.58, 2);

    ({ date, value } = lci.next());
    expect(date).toStrictEqual(new Date('2019-07-05'));
    expect(value).toBeCloseTo(1000.77, 2);
  });

  it('should generate dividends only on business days', () => {
    const lci = newLCISeq(new Date('2019-02-28'), 1000, newRate(0.05, 'year'));
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
  const lci = newLCI(new Date('2019-07-01'), 1000, newRate(0.05, 'year'), new Date('2019-10-01'));

  it('should have a title', () => {
    expect(lci.title).toBe('LCI');
  });
  it('should have a startDate', () => {
    expect(lci.startDate).toStrictEqual(new Date('2019-07-01'));
  });
  it('should have an endDate', () => {
    expect(lci.endDate).toStrictEqual(new Date('2019-10-01'));
  });
  it('should have an initialValue', () => {
    expect(lci.initialValue).toBe(1000);
  });
  it('should have a list of steps', () => {
    expect(lci.steps).toHaveLength(92);
  });
  it('should have a initial date as first step', () => {
    expect(lci.steps[0].date).toStrictEqual(new Date('2019-07-01'));
  });
  it('should have the day before the end date as last step', () => {
    expect(lci.steps[lci.steps.length - 1].date).toStrictEqual(new Date('2019-09-30'));
  });
});
