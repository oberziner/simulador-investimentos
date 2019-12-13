import f from './sequence-factory';
import { newDateGenerator, newInterestCalculator } from './investment-rules';
import { differenceDays } from './dates';
import { calculateIncomeTax } from './taxes';

const newCDBSeq = (dateGenerator, interestGenerator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);

    return interestCalculated;
  },
);

export const newCDB = (startDate, initialValue, rate, endDate) => {
  const seq = newCDBSeq(newDateGenerator(startDate), newInterestCalculator(initialValue, rate));
  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  const totalDays = differenceDays(startDate, endDate) - 1;
  const totalTaxes = calculateIncomeTax(steps[steps.length - 1].value - steps[0].value, totalDays);

  return {
    title: 'CDB',
    startDate,
    endDate,
    initialValue,
    totalTaxes,
    totalDays,
    steps,
  };
};
