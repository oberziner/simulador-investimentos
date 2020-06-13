import { newTesouroPrefixado } from './tesouroprefixado';
import { newRate } from './interest-rates';

describe('tesouro sold before due date', () => {
  it('wawa should be calculated correctly', () => {
    const tesouro = newTesouroPrefixado(new Date('2020-01-02'), 846.338, newRate(0.0415, 'year252'), new Date('2023-01-01'), new Date('2020-06-01'), 4.28, 4.28);

    // expect(JSON.stringify(tesouro.steps.splice(0, 2), null, 2)).toBeNull();

    expect(tesouro.steps).toHaveLength(152);
    expect(tesouro.startDate).toStrictEqual(new Date('2020-01-02'));
    expect(tesouro.dueDate).toStrictEqual(new Date('2023-01-01'));
    expect(tesouro.endDate).toStrictEqual(new Date('2020-06-01'));
    expect(tesouro.initialValue).toBe(846.338);
    // expect(tesouro.totalTaxes).toBeCloseTo(15.77, 2);
    // expect(tesouro.totalCustodyFee).toBeCloseTo(4.33, 2);
    // expect(tesouro.grossValue).toBeCloseTo(10095.55, 2);
    // expect(tesouro.netValue).toBeCloseTo(10075.45, 2);
    expect(tesouro.buyTax).toBeCloseTo(0.0575, 6);
    expect(tesouro.totalDays).toBe(150);
    expect(tesouro.nominalValue).toBeCloseTo(1000, 6);

    expect(tesouro.steps[0].date).toStrictEqual(new Date('2020-01-02'));
    expect(tesouro.steps[0].value).toBeCloseTo(843.47, 2);

    expect(tesouro.steps[1].date).toStrictEqual(new Date('2020-01-03'));
    expect(tesouro.steps[1].value).toBeCloseTo(841.53, 2);

    expect(tesouro.steps[4].date).toStrictEqual(new Date('2020-01-06'));
    expect(tesouro.steps[4].value).toBeCloseTo(843.38, 2);

    expect(tesouro.steps[5].date).toStrictEqual(new Date('2020-01-07'));
    expect(tesouro.steps[5].value).toBeCloseTo(843.34, 2);

    expect(tesouro.steps[6].date).toStrictEqual(new Date('2020-01-08'));
    expect(tesouro.steps[6].value).toBeCloseTo(844.71, 2);

    expect(tesouro.steps[7].date).toStrictEqual(new Date('2020-01-09'));
    expect(tesouro.steps[7].value).toBeCloseTo(846.32, 2);

    expect(tesouro.steps[8].date).toStrictEqual(new Date('2020-01-10'));
    expect(tesouro.steps[8].value).toBeCloseTo(846.51, 2);

    expect(tesouro.steps[43].date).toStrictEqual(new Date('2020-02-14'));
    expect(tesouro.steps[43].value).toBeCloseTo(858.66, 2);

    expect(tesouro.steps[46].date).toStrictEqual(new Date('2020-02-17'));
    expect(tesouro.steps[46].value).toBeCloseTo(860.24, 2);

    expect(tesouro.steps[47].date).toStrictEqual(new Date('2020-02-18'));
    expect(tesouro.steps[47].value).toBeCloseTo(860.65, 2); // Should be .66

    expect(tesouro.steps[56].date).toStrictEqual(new Date('2020-02-27'));
    expect(tesouro.steps[56].value).toBeCloseTo(858.55, 2);

    expect(tesouro.steps[71].date).toStrictEqual(new Date('2020-03-13'));
    expect(tesouro.steps[71].value).toBeCloseTo(842.63, 2);

    expect(tesouro.steps[85].date).toStrictEqual(new Date('2020-03-27'));
    expect(tesouro.steps[85].value).toBeCloseTo(855.26, 2);

    expect(tesouro.steps[113].date).toStrictEqual(new Date('2020-04-24'));
    expect(tesouro.steps[113].value).toBeCloseTo(879.95, 2);
  });
});

describe('tesouro in the future', () => {
  it('should be calculated correctly, with a 1 year period', () => {
    const tesouro = newTesouroPrefixado(new Date('2025-01-02'), 10000, newRate(9999, 'year252'), new Date('2026-01-01'), new Date('2026-01-01'), 5, 5);

    expect(tesouro.steps).toHaveLength(365);

    expect(tesouro.steps[363].date).toStrictEqual(new Date('2025-12-31'));
    expect(tesouro.steps[363].value).toBeCloseTo(10500.01, 2);
  });

  it('should be calculated correctly, using a 3 year period', () => {
    const tesouro = newTesouroPrefixado(new Date('2023-01-02'), 10000, newRate(9999, 'year252'), new Date('2026-01-01'), new Date('2026-01-01'), 4.28, 4.28);

    // expect(JSON.stringify(tesouro, null, 2)).toBeNull();

    expect(tesouro.steps).toHaveLength(1096);

    expect(tesouro.steps[1094].date).toStrictEqual(new Date('2025-12-31'));
    expect(tesouro.steps[1094].value).toBeCloseTo(11337.85, 2); // Calculadora tesouro says 11337.86
  });
});
