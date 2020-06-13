import { newTesouroIPCA } from './tesouroipca';
import { newRate } from './interest-rates';

describe('tesouro sold before due date', () => {
  it('wawa should be calculated correctly', () => {
    const tesouro = newTesouroIPCA(new Date('2020-01-02'), 2955.867824, newRate(0.04, 'year252'), new Date('2024-08-15'), new Date('2020-06-01'));

    // expect(JSON.stringify(tesouro.steps.splice(43, 2), null, 2)).toBeNull();

    expect(tesouro.steps).toHaveLength(152);
    expect(tesouro.startDate).toStrictEqual(new Date('2020-01-02'));
    expect(tesouro.dueDate).toStrictEqual(new Date('2024-08-15'));
    expect(tesouro.endDate).toStrictEqual(new Date('2020-06-01'));
    expect(tesouro.initialValue).toBe(2955.867824);
    // expect(tesouro.totalTaxes).toBeCloseTo(15.77, 2);
    // expect(tesouro.totalCustodyFee).toBeCloseTo(4.33, 2);
    // expect(tesouro.grossValue).toBeCloseTo(10095.55, 2);
    // expect(tesouro.netValue).toBeCloseTo(10075.45, 2);
    expect(tesouro.buyTax).toBeCloseTo(0.0228, 6);
    expect(tesouro.totalDays).toBe(150);
    expect(tesouro.nominalValue).toBeCloseTo(3257.583827, 6);

    expect(tesouro.steps[0].date).toStrictEqual(new Date('2020-01-02'));
    expect(tesouro.steps[0].value).toBeCloseTo(2939.98, 2);

    expect(tesouro.steps[1].date).toStrictEqual(new Date('2020-01-03'));
    expect(tesouro.steps[1].value).toBeCloseTo(2932.70, 2);

    expect(tesouro.steps[4].date).toStrictEqual(new Date('2020-01-06'));
    expect(tesouro.steps[4].value).toBeCloseTo(2939.23, 2); // should be .43

    expect(tesouro.steps[5].date).toStrictEqual(new Date('2020-01-07'));
    expect(tesouro.steps[5].value).toBeCloseTo(2933.93, 2); // should be .17

    expect(tesouro.steps[6].date).toStrictEqual(new Date('2020-01-08'));
    expect(tesouro.steps[6].value).toBeCloseTo(2935.21, 2);

    expect(tesouro.steps[7].date).toStrictEqual(new Date('2020-01-09'));
    expect(tesouro.steps[7].value).toBeCloseTo(2940.42, 2); // should be .97

    expect(tesouro.steps[8].date).toStrictEqual(new Date('2020-01-10'));
    expect(tesouro.steps[8].value).toBeCloseTo(2943.77, 2); // should be .97

    expect(tesouro.steps[43].date).toStrictEqual(new Date('2020-02-14'));
    expect(tesouro.steps[43].value).toBeCloseTo(2981.66, 2); // should be .27

    expect(tesouro.steps[46].date).toStrictEqual(new Date('2020-02-17'));
    expect(tesouro.steps[46].value).toBeCloseTo(2988.59, 2);

    expect(tesouro.steps[47].date).toStrictEqual(new Date('2020-02-18'));
    expect(tesouro.steps[47].value).toBeCloseTo(2986.39, 2);

    expect(tesouro.steps[56].date).toStrictEqual(new Date('2020-02-27'));
    expect(tesouro.steps[56].value).toBeCloseTo(2976.20, 2);

    expect(tesouro.steps[71].date).toStrictEqual(new Date('2020-03-13'));
    expect(tesouro.steps[71].value).toBeCloseTo(2862.26, 2);

    expect(tesouro.steps[85].date).toStrictEqual(new Date('2020-03-27'));
    expect(tesouro.steps[85].value).toBeCloseTo(2852.97, 2);

    expect(tesouro.steps[113].date).toStrictEqual(new Date('2020-04-24'));
    expect(tesouro.steps[113].value).toBeCloseTo(2966.69, 2);
  });
});

describe('tesouro in the future', () => {
  it('should be calculated correctly, using projected values', () => {
    const tesouro = newTesouroIPCA(new Date('2023-01-02'), 10000, newRate(0.04, 'year252'), new Date('2035-05-15'), new Date('2035-05-15'), 4.26, 4.26);

    // expect(JSON.stringify(tesouro.steps.splice(4516, 2), null, 2)).toBeNull();

    expect(tesouro.steps).toHaveLength(4517);

    expect(tesouro.steps[4516].date).toStrictEqual(new Date('2035-05-15'));
    expect(tesouro.steps[4516].value).toBeCloseTo(27158.71, 2); // Calculadora tesouro says 27100.16
  });
});
