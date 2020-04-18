import f from './sequence-factory';
import { newRate } from './interest-rates';
import { newDateGenerator, newInterestCalculator } from './investment-rules';
import { getPreviousBusinessDayRates } from '../repositories/dates-and-taxes';

export const newLCISeq = (dateGenerator, interestGenerator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);

    return interestCalculated;
  },
);

export const newLCI = (startDate, initialValue, rate, percentRate, endDate) => {
  const lciRate = newRate(rate.yearly252Rate() * (percentRate / 100), 'year252');

  const repo = {
    find: (date) => {
      const dayRate = Object.assign({}, getPreviousBusinessDayRates(date));
      const rateObj = newRate(dayRate.yearlySelic / 100, 'year252');
      dayRate.dailySelic = ((rateObj.dailyRate()) * (percentRate / 100)) + 1;
      return dayRate;
    },
  };

  const seq = newLCISeq(
    newDateGenerator(startDate),
    newInterestCalculator(initialValue, lciRate, repo),
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
