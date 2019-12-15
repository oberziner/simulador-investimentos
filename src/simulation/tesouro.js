import f from './sequence-factory';
import { newDateGenerator, newInterestCalculator, newCustodyFeeCalculator } from './investment-rules';
import { differenceDays } from './dates';
import { calculateIncomeTax } from './taxes';
import { newRate } from './interest-rates';

const newTesouroSeq = (dateGenerator, interestGenerator, custodyFeeCalculator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);
    const custodyFeeAdded = custodyFeeCalculator(interestCalculated);

    return custodyFeeAdded;
  },
);

export const newTesouro = (startDate, initialValue, rate, endDate) => {
  const seq = newTesouroSeq(
    newDateGenerator(startDate),
    newInterestCalculator(initialValue, rate),
    newCustodyFeeCalculator(newRate(0.0025, 'year364')),
  );

  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  const totalDays = differenceDays(startDate, endDate) - 1;
  const totalTaxes = calculateIncomeTax(steps[steps.length - 1].value - steps[0].value, totalDays);

  return {
    title: 'Tesouro Direto',
    startDate,
    endDate,
    initialValue,
    totalTaxes,
    totalDays,
    steps,
  };
};
