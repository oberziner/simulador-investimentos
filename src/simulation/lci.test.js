import { newLCI } from './lci';
import { newRate } from './interest-rates';

describe('lci sequence', () => {
  it('first .next should return the invested value', () => {
    expect(newLCI(new Date('2019-06-01'), 1000).next()).toStrictEqual({
      date: new Date('2019-06-01'),
      value: 1000,
    });
  });

  it('subsequent .next should return the updated value for each day', () => {
    const lci = newLCI(new Date('2019-07-01'), 1000, newRate(0.05, 'year'));
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
});
