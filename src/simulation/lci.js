import f from './sequence-factory';
import { newRate } from './interest-rates';
import { newDateGenerator, newInterestCalculator } from './investment-rules';

export const newLCISeq = (dateGenerator, interestGenerator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);

    return interestCalculated;
  },
);

export const newLCI = (startDate, initialValue, rate, percentRate, endDate) => {
  const lciRate = newRate(rate.yearly252Rate() * (percentRate / 100), 'year252');
  const seq = newLCISeq(newDateGenerator(startDate), newInterestCalculator(initialValue, lciRate));
  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  const grossValue = steps[steps.length - 1].value;
  const totalTaxes = 0;
  const netValue = grossValue - totalTaxes;

  return {
    title: `LCI ${percentRate}% SELIC ${rate.toString()}`,
    startDate,
    endDate,
    initialValue,
    grossValue,
    totalTaxes,
    netValue,
    steps,
  };
};
