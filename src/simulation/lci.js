import f from './sequence-factory';
import dates from './dates';

export const newLCI = (initialDate, initialValue, rate) => f.newSequence(
  { date: initialDate, value: initialValue },
  (prev) => ({
    date: dates.getNextDay(prev.date),
    value: prev.value * (1 + rate.dailyRate()),
  }),
);
