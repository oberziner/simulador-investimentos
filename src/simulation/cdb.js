import f from './sequence-factory';
import { newDateGenerator, newInterestCalculator } from './investment-rules';
import { differenceDays } from './dates';
import { newRate } from './interest-rates';
import { calculateIncomeTax } from './taxes';

const newCDBSeq = (dateGenerator, interestGenerator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);

    return interestCalculated;
  },
);

export const newCDB = (startDate, initialValue, rate, percentRate, endDate) => {
  const cdbRate = newRate(rate.yearly252Rate() * (percentRate / 100), 'year252');
  const seq = newCDBSeq(newDateGenerator(startDate), newInterestCalculator(initialValue, cdbRate));
  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  const totalDays = differenceDays(startDate, endDate) - 1;
  const grossValue = steps[steps.length - 1].value;
  const totalTaxes = calculateIncomeTax(grossValue - initialValue, totalDays);
  const netValue = grossValue - totalTaxes;

  return {
    title: `CDB ${percentRate}% SELIC ${rate.toString()}`,
    startDate,
    endDate,
    initialValue,
    totalTaxes,
    grossValue,
    netValue,
    totalDays,
    steps,
  };
};
