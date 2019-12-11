import f from './sequence-factory';
import { getNextDay, isBusinessDay } from './dates';

export const newLCISeq = (initialDate, initialValue, rate) => f.newSequence(
  { date: initialDate, value: initialValue },
  (prev) => {
    const date = getNextDay(prev.date);
    let newValue = prev.value;

    if (isBusinessDay(date)) {
      newValue *= (1 + rate.dailyRate());
    }

    return {
      date,
      value: newValue,
    };
  },
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
