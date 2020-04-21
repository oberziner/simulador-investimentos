import { newTesouro } from './tesouro';
import { newRate } from './interest-rates';

describe('tesouro object', () => {
  const tesouro = newTesouro(new Date('2018-04-03'), 1000, newRate(0.05, 'year252'), new Date('2018-06-03'), new Date('2018-06-03'));

  it('should have a title with the rate being used', () => {
    expect(tesouro.title).toBe('Tesouro Direto 5% a.a.');
  });
  it('should have a startDate', () => {
    expect(tesouro.startDate).toStrictEqual(new Date('2018-04-03'));
  });
  it('should have an endDate', () => {
    expect(tesouro.endDate).toStrictEqual(new Date('2018-06-03'));
  });
  it('should have an initialValue', () => {
    expect(tesouro.initialValue).toBe(1000);
  });
  it('should have a list of steps', () => {
    expect(tesouro.steps).toHaveLength(62);
  });
  it('should have initial date and initial value as first step', () => {
    const step0 = tesouro.steps[0];
    expect(step0.date).toStrictEqual(new Date('2018-04-03'));
    expect(step0.value).toBeCloseTo(999.98, 2);
  });
  it('should have the end date as last step with the correct value', () => {
    expect(tesouro.steps[tesouro.steps.length - 1].date).toStrictEqual(new Date('2018-06-03'));
    expect(tesouro.steps[tesouro.steps.length - 1].value).toBeCloseTo(1010.17, 2);
  });
  it('should have the correct values for the dates', () => {
    expect(tesouro.steps[23].date).toStrictEqual(new Date('2018-04-26'));
    expect(tesouro.steps[23].value).toBeCloseTo(1004.19, 2);

    expect(tesouro.steps[49].date).toStrictEqual(new Date('2018-05-22'));
    expect(tesouro.steps[49].value).toBeCloseTo(1008.42, 2);
  });
  it('.totalDays should return the number of days between the initial date and the end date', () => {
    expect(tesouro.totalDays).toBe(60);
  });
  it('.totalTaxes should return ammount of taxes to be charged', () => {
    expect(tesouro.totalTaxes).toBeCloseTo(2.29, 2);
  });
  it('.totalCustodyFee should return the total of custody fees owed', () => {
    expect(tesouro.totalCustodyFee).toBeCloseTo(0.41, 2);
  });
  it('should have an grossValue', () => {
    expect(tesouro.grossValue).toBeCloseTo(1010.17, 2);
  });
  it('.netValue should return the grossValue minus taxes', () => {
    expect(tesouro.netValue).toBeCloseTo(1007.47, 2);
  });
  it('should calculate a daily custody fee of 0.25% per year', () => {
    const tesouroCustodyFee = newTesouro(new Date('2019-03-01'), 1000000, newRate(0.05, 'year252'), new Date('2019-05-03'), new Date('2019-05-03'));
    expect(tesouroCustodyFee.steps[1].custodyFee).toBeCloseTo(0, 2);
    expect(tesouroCustodyFee.steps[2].custodyFee).toBeCloseTo(6.84, 2);
    expect(tesouroCustodyFee.steps[61].custodyFee).toBeCloseTo(6.906, 2);
  });
  it('.totalCustodyFee should aggregate all custody fees on the investment', () => {
    const tesouroCustodyFee = newTesouro(new Date('2018-04-03'), 1000000, newRate(0.05, 'year252'), new Date('2018-06-03'), new Date('2018-06-03'));
    expect(tesouroCustodyFee.totalCustodyFee).toBeCloseTo(412.68, 2);
  });
});

describe('tesouro object taxes', () => {
  it('should be charged not counting the start and end days', () => {
    let tesouro = newTesouro(new Date('2018-04-03'), 10000, newRate(0.05, 'year252'), new Date('2018-10-01'), new Date('2018-10-01'));
    expect(tesouro.totalDays).toBe(180);
    expect(tesouro.totalTaxes).toBeCloseTo(71.11, 2);

    tesouro = newTesouro(new Date('2018-04-03'), 10000, newRate(0.05, 'year252'), new Date('2018-10-02'), new Date('2018-10-02'));
    expect(tesouro.totalDays).toBe(181);
    expect(tesouro.totalTaxes).toBeCloseTo(63.72, 2);
  });
});

describe('tesouro values', () => {
  it('should be calculated correctly', () => {
    const tesouro = newTesouro(new Date('2020-02-20'), 10524.898433084, newRate(0.0415, 'year252'), new Date('2025-03-01'), new Date('2025-03-01'));

    // expect(JSON.stringify(tesouro.steps.splice(0, 10), null, 2))
    // .toStrictEqual(new Date('2020-02-21'));
    expect(tesouro.steps[0].date).toStrictEqual(new Date('2020-02-20'));
    expect(tesouro.steps[0].value).toBeCloseTo(10519.62, 2);
    expect(tesouro.steps[0].totalCustodyFee).toBe(0);

    expect(tesouro.steps[1].date).toStrictEqual(new Date('2020-02-21'));
    expect(tesouro.steps[1].value).toBeCloseTo(10521.33, 2);
    expect(tesouro.steps[1].totalCustodyFee).toBe(0);

    expect(tesouro.steps[2].date).toStrictEqual(new Date('2020-02-22'));
    expect(tesouro.steps[2].value).toBeCloseTo(10521.34, 2);

    expect(tesouro.steps[3].date).toStrictEqual(new Date('2020-02-23'));
    expect(tesouro.steps[3].value).toBeCloseTo(10521.34, 2);

    expect(tesouro.steps[4].date).toStrictEqual(new Date('2020-02-24'));
    expect(tesouro.steps[4].value).toBeCloseTo(10521.34, 2);

    expect(tesouro.steps[5].date).toStrictEqual(new Date('2020-02-25'));
    expect(tesouro.steps[5].value).toBeCloseTo(10521.34, 2);
    expect(tesouro.steps[5].totalCustodyFee).toBeCloseTo(0.287, 2);

    expect(tesouro.steps[6].date).toStrictEqual(new Date('2020-02-26'));
    expect(tesouro.steps[6].value).toBeCloseTo(10523.04, 2);
    expect(tesouro.steps[6].totalCustodyFee).toBeCloseTo(0.359, 2);

    expect(tesouro.steps[7].date).toStrictEqual(new Date('2020-02-27'));
    expect(tesouro.steps[7].value).toBeCloseTo(10524.75, 2);
    expect(tesouro.steps[7].totalCustodyFee).toBeCloseTo(0.43, 2);

    expect(tesouro.steps[8].date).toStrictEqual(new Date('2020-02-28'));
    expect(tesouro.steps[8].value).toBeCloseTo(10526.46, 2);
    expect(tesouro.steps[8].totalCustodyFee).toBeCloseTo(0.50, 2);

    expect(tesouro.steps[9].date).toStrictEqual(new Date('2020-02-29'));
    expect(tesouro.steps[9].value).toBeCloseTo(10526.47, 2);
    expect(tesouro.steps[9].totalCustodyFee).toBeCloseTo(0.575, 2);

    expect(tesouro.steps[10].date).toStrictEqual(new Date('2020-03-01'));
    expect(tesouro.steps[10].value).toBeCloseTo(10526.47, 2);

    expect(tesouro.steps[11].date).toStrictEqual(new Date('2020-03-02'));
    expect(tesouro.steps[11].value).toBeCloseTo(10522.93, 2);
    expect(tesouro.steps[11].totalCustodyFee).toBeCloseTo(0.719, 2);

    expect(tesouro.steps[12].date).toStrictEqual(new Date('2020-03-03'));
    expect(tesouro.steps[12].value).toBeCloseTo(10524.64, 2);
    expect(tesouro.steps[12].totalCustodyFee).toBeCloseTo(0.79, 2);

    expect(tesouro.steps[13].date).toStrictEqual(new Date('2020-03-04'));
    expect(tesouro.steps[13].value).toBeCloseTo(10526.36, 2);
    expect(tesouro.steps[13].totalCustodyFee).toBeCloseTo(0.86, 2);

    expect(tesouro.steps[14].date).toStrictEqual(new Date('2020-03-05'));
    expect(tesouro.steps[14].value).toBeCloseTo(10528.07, 2);
    expect(tesouro.steps[14].totalCustodyFee).toBeCloseTo(0.935, 2);

    expect(tesouro.steps[15].date).toStrictEqual(new Date('2020-03-06'));
    expect(tesouro.steps[15].value).toBeCloseTo(10529.79, 2);
    expect(tesouro.steps[15].totalCustodyFee).toBeCloseTo(1.007, 2);
  });
});

describe('tesouro sold before due date', () => {
  it('wawa should be calculated correctly', () => {
    const tesouro = newTesouro(new Date('2019-12-16'), 10025.47264, newRate(0.0415, 'year252'), new Date('2025-03-01'), new Date('2020-02-18'));

    // expect(JSON.stringify(tesouro.steps.splice(0, 10), null, 2))
    // .toStrictEqual(new Date('2020-02-21'));
    expect(tesouro.steps).toHaveLength(65);
    expect(tesouro.startDate).toStrictEqual(new Date('2019-12-16'));
    expect(tesouro.dueDate).toStrictEqual(new Date('2025-03-01'));
    expect(tesouro.endDate).toStrictEqual(new Date('2020-02-18'));
    expect(tesouro.initialValue).toBe(10025.47264);
    expect(tesouro.totalTaxes).toBeCloseTo(15.77, 2);
    expect(tesouro.totalCustodyFee).toBeCloseTo(4.33, 2);
    expect(tesouro.grossValue).toBeCloseTo(10095.55, 2);
    expect(tesouro.netValue).toBeCloseTo(10075.45, 2);
    expect(tesouro.totalDays).toBe(63);

    expect(tesouro.steps[0].date).toStrictEqual(new Date('2019-12-16'));
    expect(tesouro.steps[0].value).toBeCloseTo(10020.27, 2);
    expect(tesouro.steps[0].totalCustodyFee).toBe(0);

    expect(tesouro.steps[2].date).toStrictEqual(new Date('2019-12-18'));
    expect(tesouro.steps[2].value).toBeCloseTo(10023.71, 2);
    expect(tesouro.steps[2].totalCustodyFee).toBeCloseTo(0.068, 2);

    expect(tesouro.steps[3].date).toStrictEqual(new Date('2019-12-19'));
    expect(tesouro.steps[3].value).toBeCloseTo(10025.44, 2); // should be .43
    expect(tesouro.steps[3].totalCustodyFee).toBeCloseTo(0.137, 2);

    expect(tesouro.steps[5].date).toStrictEqual(new Date('2019-12-21'));
    expect(tesouro.steps[5].value).toBeCloseTo(10027.18, 2); // should be .17
    expect(tesouro.steps[5].totalCustodyFee).toBeCloseTo(0.274, 2);

    expect(tesouro.steps[10].date).toStrictEqual(new Date('2019-12-26'));
    expect(tesouro.steps[10].value).toBeCloseTo(10032.34, 2);
    expect(tesouro.steps[10].totalCustodyFee).toBeCloseTo(0.616, 2);

    expect(tesouro.steps[18].date).toStrictEqual(new Date('2020-01-03'));
    expect(tesouro.steps[18].value).toBeCloseTo(10040.98, 2); // should be .97
    expect(tesouro.steps[18].totalCustodyFee).toBeCloseTo(1.165, 2);

    expect(tesouro.steps[62].date).toStrictEqual(new Date('2020-02-16'));
    expect(tesouro.steps[62].value).toBeCloseTo(10092.28, 2); // should be .27
    expect(tesouro.steps[62].totalCustodyFee).toBeCloseTo(4.19, 2);

    expect(tesouro.steps[63].date).toStrictEqual(new Date('2020-02-17'));
    expect(tesouro.steps[63].value).toBeCloseTo(10093.91, 2);
    expect(tesouro.steps[63].totalCustodyFee).toBeCloseTo(4.26, 2);

    expect(tesouro.steps[64].date).toStrictEqual(new Date('2020-02-18'));
    expect(tesouro.steps[64].value).toBeCloseTo(10095.55, 2);
    expect(tesouro.steps[64].totalCustodyFee).toBeCloseTo(4.33, 2);
  });
});
