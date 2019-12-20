import f from './sequence-factory';
import { newDateGenerator, newInterestCalculator } from './investment-rules';

export const newLCISeq = (dateGenerator, interestGenerator) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculated = interestGenerator(nextDayCalculated);

    return interestCalculated;
  },
);

export const newLCI = (startDate, initialValue, rate, endDate) => {
  const seq = newLCISeq(newDateGenerator(startDate), newInterestCalculator(initialValue, rate));
  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  return {
    title: `LCI ${rate.toString()}`,
    startDate,
    endDate,
    initialValue,
    steps,
  };
};
