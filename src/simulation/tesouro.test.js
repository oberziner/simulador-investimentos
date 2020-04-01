import { newTesouro } from './tesouro';
import { newRate } from './interest-rates';

describe('tesouro object', () => {
  const tesouro = newTesouro(new Date('2018-04-03'), 1000, newRate(0.05, 'year252'), new Date('2018-06-03'));

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
    expect(tesouro.steps).toHaveLength(61);
  });
  it('should have initial date and initial value as first step', () => {
    const step0 = tesouro.steps[0];
    expect(step0.date).toStrictEqual(new Date('2018-04-03'));
    expect(step0.value).toBeCloseTo(999.98, 2);
  });
  it('should have the day before the end date as last step with the correct value', () => {
    expect(tesouro.steps[tesouro.steps.length - 1].date).toStrictEqual(new Date('2018-06-02'));
    expect(tesouro.steps[tesouro.steps.length - 1].value).toBeCloseTo(1010.18, 2);
  });
  it('should have the correct values for the dates', () => {
    expect(tesouro.steps[23].date).toStrictEqual(new Date('2018-04-26'));
    expect(tesouro.steps[23].value).toBeCloseTo(1004.20, 2);

    expect(tesouro.steps[49].date).toStrictEqual(new Date('2018-05-22'));
    expect(tesouro.steps[49].value).toBeCloseTo(1008.43, 2);
  });
  it('.totalDays should return the number of days between the initial date and the end date', () => {
    expect(tesouro.totalDays).toBe(60);
  });
  it('.totalTaxes should return ammount of taxes to be charged', () => {
    expect(tesouro.totalTaxes).toBeCloseTo(2.29, 2);
  });
  it('should calculate a daily custody fee of 0.25% per year', () => {
    const tesouroCustodyFee = newTesouro(new Date('2019-03-01'), 1000000, newRate(0.05, 'year252'), new Date('2019-05-03'));
    expect(tesouroCustodyFee.steps[1].custodyFee).toBeCloseTo(0, 2);
    expect(tesouroCustodyFee.steps[2].custodyFee).toBeCloseTo(6.86, 2);
    expect(tesouroCustodyFee.steps[61].custodyFee).toBeCloseTo(6.93, 2);
  });
  it('.totalCustodyFee should aggregate all custody fees on the investment', () => {
    const tesouroCustodyFee = newTesouro(new Date('2018-04-03'), 1000000, newRate(0.05, 'year252'), new Date('2018-06-03'));
    expect(tesouroCustodyFee.totalCustodyFee).toBeCloseTo(406.89, 2);
  });
});

describe('tesouro object taxes', () => {
  it('should be charged not counting the start and end days', () => {
    let tesouro = newTesouro(new Date('2018-04-03'), 10000, newRate(0.05, 'year252'), new Date('2018-10-01'));
    expect(tesouro.totalDays).toBe(180);
    expect(tesouro.totalTaxes).toBeCloseTo(70.54, 2);

    tesouro = newTesouro(new Date('2018-04-03'), 10000, newRate(0.05, 'year252'), new Date('2018-10-02'));
    expect(tesouro.totalDays).toBe(181);
    expect(tesouro.totalTaxes).toBeCloseTo(63.21, 2);
  });
});

describe('tesouro values', () => {
  it('should be calculated correctly', () => {
    const tesouro = newTesouro(new Date('2020-02-20'), 10524.88, newRate(0.0415, 'year252'), new Date('2025-02-25'));

    // expect(JSON.stringify(tesouro.steps.splice(0, 10), null, 2))
    // .toStrictEqual(new Date('2020-02-21'));
    expect(tesouro.steps[0].date).toStrictEqual(new Date('2020-02-20'));
    expect(tesouro.steps[0].value).toBeCloseTo(10519.62, 2);
    expect(tesouro.steps[0].custodyFee).toBe(0);

    expect(tesouro.steps[1].date).toStrictEqual(new Date('2020-02-21'));
    expect(tesouro.steps[1].value).toBeCloseTo(10521.33, 2);
    expect(tesouro.steps[1].custodyFee).toBe(0);

    expect(tesouro.steps[2].date).toStrictEqual(new Date('2020-02-22'));
    expect(tesouro.steps[2].value).toBeCloseTo(10521.33, 2);
    expect(tesouro.steps[2].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[3].date).toStrictEqual(new Date('2020-02-23'));
    expect(tesouro.steps[3].value).toBeCloseTo(10521.33, 2);
    expect(tesouro.steps[3].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[4].date).toStrictEqual(new Date('2020-02-24'));
    expect(tesouro.steps[4].value).toBeCloseTo(10521.33, 2);
    expect(tesouro.steps[4].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[5].date).toStrictEqual(new Date('2020-02-25'));
    expect(tesouro.steps[5].value).toBeCloseTo(10521.33, 2);
    expect(tesouro.steps[5].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[6].date).toStrictEqual(new Date('2020-02-26'));
    expect(tesouro.steps[6].value).toBeCloseTo(10523.04, 2);
    expect(tesouro.steps[6].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[7].date).toStrictEqual(new Date('2020-02-27'));
    expect(tesouro.steps[7].value).toBeCloseTo(10524.76, 2);
    expect(tesouro.steps[7].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[8].date).toStrictEqual(new Date('2020-02-28'));
    expect(tesouro.steps[8].value).toBeCloseTo(10526.47, 2);
    expect(tesouro.steps[9].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[9].date).toStrictEqual(new Date('2020-02-29'));
    expect(tesouro.steps[9].value).toBeCloseTo(10526.47, 2);
    expect(tesouro.steps[9].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[10].date).toStrictEqual(new Date('2020-03-01'));
    expect(tesouro.steps[10].value).toBeCloseTo(10526.47, 2);
    expect(tesouro.steps[10].custodyFee).toBeCloseTo(0.0722, 4);

    expect(tesouro.steps[11].date).toStrictEqual(new Date('2020-03-02'));
    expect(tesouro.steps[11].value).toBeCloseTo(10522.94, 2);

    expect(tesouro.steps[12].date).toStrictEqual(new Date('2020-03-03'));
    expect(tesouro.steps[12].value).toBeCloseTo(10524.66, 2);

    expect(tesouro.steps[13].date).toStrictEqual(new Date('2020-03-04'));
    expect(tesouro.steps[13].value).toBeCloseTo(10526.37, 2);

    expect(tesouro.steps[14].date).toStrictEqual(new Date('2020-03-05'));
    expect(tesouro.steps[14].value).toBeCloseTo(10528.08, 2);

    expect(tesouro.steps[15].date).toStrictEqual(new Date('2020-03-06'));
    expect(tesouro.steps[15].value).toBeCloseTo(10529.80, 2);
  });
});
