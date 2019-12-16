import { newTesouro } from './tesouro';
import { newRate } from './interest-rates';

describe('tesouro object', () => {
  const tesouro = newTesouro(new Date('2019-03-01'), 1000, newRate(0.05, 'year252'), new Date('2019-05-03'));

  it('should have a title', () => {
    expect(tesouro.title).toBe('Tesouro Direto');
  });
  it('should have a startDate', () => {
    expect(tesouro.startDate).toStrictEqual(new Date('2019-03-01'));
  });
  it('should have an endDate', () => {
    expect(tesouro.endDate).toStrictEqual(new Date('2019-05-03'));
  });
  it('should have an initialValue', () => {
    expect(tesouro.initialValue).toBe(1000);
  });
  it('should have a list of steps', () => {
    expect(tesouro.steps).toHaveLength(63);
  });
  it('should have initial date and initial value as first step', () => {
    const step0 = tesouro.steps[0];
    expect(step0.date).toStrictEqual(new Date('2019-03-01'));
    expect(step0.value).toBe(1000);
  });
  it('should have the day before the end date as last step with the correct value', () => {
    expect(tesouro.steps[tesouro.steps.length - 1].date).toStrictEqual(new Date('2019-05-02'));
    expect(tesouro.steps[tesouro.steps.length - 1].value).toBeCloseTo(1007.77, 2);
  });
  it('should have the correct values for the dates', () => {
    expect(tesouro.steps[23].date).toStrictEqual(new Date('2019-03-24'));
    expect(tesouro.steps[23].value).toBeCloseTo(1002.52, 2);

    expect(tesouro.steps[49].date).toStrictEqual(new Date('2019-04-19'));
    expect(tesouro.steps[49].value).toBeCloseTo(1006.21, 2);
  });
  it('steps[n].elapsedDays should return the number of days elapsed since startDate', () => {
    expect(tesouro.steps[0].elapsedDays).toBe(0);
    expect(tesouro.steps[1].elapsedDays).toBe(1);
    expect(tesouro.steps[30].elapsedDays).toBe(30);
  });
  it('should have tax field with ammount of taxes to be charged', () => {
    expect(tesouro.totalTaxes).toBeCloseTo(1.75, 2);
  });
  it('.totalDays should return the number of days between the initial date and the end date', () => {
    expect(tesouro.totalDays).toBe(62);
  });
  it('.totalTaxes should return ammount of taxes to be charged', () => {
    expect(tesouro.totalTaxes).toBeCloseTo(1.75, 2);
  });
  it('should calculate a daily custody fee of 0.25% per year', () => {
    const tesouroCustodyFee = newTesouro(new Date('2019-03-01'), 1000000, newRate(0.05, 'year252'), new Date('2019-05-03'));
    expect(tesouroCustodyFee.steps[1].custodyFee).toBeCloseTo(6.86, 2);
    expect(tesouroCustodyFee.steps[2].custodyFee).toBeCloseTo(6.86, 2);
    expect(tesouroCustodyFee.steps[61].custodyFee).toBeCloseTo(6.91, 2);
  });
  it('.totalCustodyFee should aggregate all custody fees on the investment', () => {
    const tesouroCustodyFee = newTesouro(new Date('2019-03-01'), 1000000, newRate(0.05, 'year252'), new Date('2019-05-03'));
    console.log(tesouroCustodyFee)
    expect(tesouroCustodyFee.totalCustodyFee).toBeCloseTo(426.86, 2);
  });
});

describe('tesouro object taxes', () => {
  it('should be charged not counting the start and end days', () => {
    let tesouro = newTesouro(new Date('2019-04-03'), 10000, newRate(0.05, 'year252'), new Date('2019-10-01'));
    expect(tesouro.totalDays).toBe(180);
    expect(tesouro.totalTaxes).toBeCloseTo(55.12, 2);

    tesouro = newTesouro(new Date('2019-04-03'), 10000, newRate(0.05, 'year252'), new Date('2019-10-02'));
    expect(tesouro.totalDays).toBe(181);
    expect(tesouro.totalTaxes).toBeCloseTo(49.39, 2);
  });
});
