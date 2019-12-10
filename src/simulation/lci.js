import f from './sequence-factory';
import dates from './dates';

export const newLCISeq = (initialDate, initialValue, rate) => f.newSequence(
  { date: initialDate, value: initialValue },
  (prev) => ({
    date: dates.getNextDay(prev.date),
    value: prev.value * (1 + rate.dailyRate()),
  }),
);

export const newLCI = (startDate, initialValue, rate, endDate) => {
  const seq = newLCISeq(startDate, initialValue, rate);
  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  return {
    title: 'LCI',
    startDate,
    endDate,
    initialValue,
    steps,
  };
};
