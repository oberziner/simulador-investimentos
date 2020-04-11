import f from './sequence-factory';
import {
  newDateGenerator,
  newInterestCalculator,
  newInterestCalculatorNominalValue,
  newNominalValueProjector,
  newCustodyFeeCalculator,
  newAdjusmentFactorCalculator,
  newValueAdjuster,
} from './investment-rules';
import { differenceDays, findDate, getPreviousBusinessDayRates } from './dates';
import { calculateIncomeTax } from './taxes';
import { newRate } from './interest-rates';

const newTesouroSeq = (dateGenerator,
  interestGenerator,
  interestGeneratorNominalValue,
  nominalValueProjector,
  custodyFeeCalculator,
  adjusmentFactorCalculator,
  valueAdjuster) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculatedNominalValue = interestGeneratorNominalValue(nextDayCalculated);
    const nominalValueProjected = nominalValueProjector(interestCalculatedNominalValue);
    const interestCalculated = interestGenerator(nominalValueProjected);
    const adjusmentFactorCalculated = adjusmentFactorCalculator(interestCalculated);
    const custodyFeeAdded = custodyFeeCalculator(adjusmentFactorCalculated);
    const adjustedValue = valueAdjuster(custodyFeeAdded);

    return adjustedValue;
  },
);

const nominalValueFromBuyPrice = (startDate, endDate, initialValue, buyPremium, yearlySelic) => {
  const adjusmentFactorCalculator = newAdjusmentFactorCalculator(buyPremium, endDate);
  const { adjustmentFactor } = adjusmentFactorCalculator({ date: startDate });
  const projectedNominalValue = initialValue / adjustmentFactor;
  const metaSelicDiaria = newRate((1 * yearlySelic + 0.1) / 100, 'year252');
  return projectedNominalValue / (metaSelicDiaria.dailyRate() + 1);
};

export const newTesouro = (startDate, initialValue, rate, endDate, sellingDate = endDate) => {
  const nominalValue = nominalValueFromBuyPrice(startDate,
    endDate, initialValue, 0.0002, getPreviousBusinessDayRates(startDate).yearlySelic);

  const repo = {
    find: (date) => findDate(date),
    findPreviousBusinessDay: (date) => getPreviousBusinessDayRates(date),
  };

  const seq = newTesouroSeq(
    newDateGenerator(startDate),
    newInterestCalculator(nominalValue, rate, repo),
    newInterestCalculatorNominalValue(nominalValue, rate, repo),
    newNominalValueProjector(rate, repo),
    newCustodyFeeCalculator(startDate, newRate(0.0025, 'year365')),
    newAdjusmentFactorCalculator(0.0003, endDate, repo),
    newValueAdjuster(),
  );

  const steps = [];

  for (let i = seq.next(); ((i.date <= sellingDate)); i = seq.next()) {
    steps.push(i);
  }

  const totalDays = differenceDays(startDate, sellingDate) - 1;
  const totalTaxes = calculateIncomeTax(steps[steps.length - 1].value - initialValue, totalDays);
  const totalCustodyFee = steps.reduce((total, i) => total + i.custodyFee, 0);

  return {
    title: `Tesouro Direto ${rate.toString()}`,
    startDate,
    endDate,
    initialValue,
    totalTaxes,
    totalDays,
    totalCustodyFee,
    steps,
  };
};
