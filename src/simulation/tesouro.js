import f from './sequence-factory';
import {
  newDateGenerator,
  newInterestCalculator,
  newInterestCalculatorNominalValue,
  newCustodyFeeCalculator,
  newAdjusmentFactorCalculator,
  newValueAdjuster,
} from './investment-rules';
import { differenceDays } from './dates';
import { calculateIncomeTax } from './taxes';
import { newRate } from './interest-rates';

const newTesouroSeq = (dateGenerator,
  interestGenerator,
  interestGeneratorNominalValue,
  custodyFeeCalculator,
  adjusmentFactorCalculator,
  valueAdjuster) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculatedNominalValue = interestGeneratorNominalValue(nextDayCalculated);
    const interestCalculated = interestGenerator(interestCalculatedNominalValue);
    const adjusmentFactorCalculated = adjusmentFactorCalculator(interestCalculated);
    const custodyFeeAdded = custodyFeeCalculator(adjusmentFactorCalculated);
    const adjustedValue = valueAdjuster(custodyFeeAdded);

    return adjustedValue;
  },
);

export const newTesouro = (startDate, initialValue, rate, endDate) => {
  const adjusmentFactorCalculator = newAdjusmentFactorCalculator(0.0002, endDate);
  const { adjustmentFactor } = adjusmentFactorCalculator({ date: startDate });
  const nominalValue = initialValue / adjustmentFactor;

  const seq = newTesouroSeq(
    newDateGenerator(startDate),
    newInterestCalculator(nominalValue, rate),
    newInterestCalculatorNominalValue(nominalValue, rate),
    newCustodyFeeCalculator(newRate(0.0025, 'year364')),
    newAdjusmentFactorCalculator(0.0003, endDate),
    newValueAdjuster(),
  );

  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  const totalDays = differenceDays(startDate, endDate) - 1;
  const totalTaxes = calculateIncomeTax(steps[steps.length - 1].value - steps[0].value, totalDays);
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
