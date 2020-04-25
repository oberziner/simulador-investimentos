import f from './sequence-factory';
import { newDateGenerator, newInterestCalculator } from './investment-rules';
import { newRepositoryWithProjectedValues } from '../repositories/dates-and-taxes';

export const newLCISeq = (dateGenerator, interestGenerator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);

    return interestCalculated;
  },
);

export const newLCI = (startDate, initialValue, rate, percentRate, endDate) => {
  const repof = newRepositoryWithProjectedValues({
    selic: {
      dailyRate: () => rate.dailyRate() + 1,
      yearlyRate: () => rate.yearly252Rate() * 100,
    },
  });

  const repo = {
    getDailyRate: (date) => {
      const dayRate = repof.getSelicForPreviousBusinessDay(date).dailyRate() - 1;
      return ((dayRate * (percentRate / 100))) + 1;
    },
  };

  const seq = newLCISeq(
    newDateGenerator(startDate),
    newInterestCalculator(initialValue, repo),
  );
  const steps = [];

  for (let i = seq.next(); ((i.date <= endDate)); i = seq.next()) {
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
