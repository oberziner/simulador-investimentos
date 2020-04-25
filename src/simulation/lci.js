import f from './sequence-factory';
import { newRate } from './interest-rates';
import { newDateGenerator, newInterestCalculator } from './investment-rules';
import { newRepositoryWithFuture } from '../repositories/dates-and-taxes';

export const newLCISeq = (dateGenerator, interestGenerator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);

    return interestCalculated;
  },
);

export const newLCI = (startDate, initialValue, rate, percentRate, endDate) => {
  const repof = newRepositoryWithFuture({
    dailySelic: rate.dailyRate() + 1,
    yearlySelic: rate.yearly252Rate() * 100,
  });

  const repo = {
    getDailyRate: (date) => {
      const dayRate = repof.getPreviousBusinessYearSelic(date);
      const rateObj = newRate((dayRate / 100), 'year252');
      return ((rateObj.dailyRate() * (percentRate / 100))) + 1;
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
