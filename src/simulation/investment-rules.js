import { getNextDay, isBusinessDay } from './dates';

export const newDateGenerator = (defaultDate) => (prev) => {
  const newObject = Object.assign({}, prev);
  if (newObject.date) {
    newObject.date = getNextDay(newObject.date);
  } else {
    newObject.date = defaultDate;
  }
  return newObject;
};

export const newInterestCalculator = (defaultValue, rate) => (prev) => {
  const newObject = Object.assign({}, prev);

  if (prev.value) {
    if (isBusinessDay(newObject.date)) {
      newObject.value *= (1 + rate.dailyRate());
    }
  } else {
    newObject.value = defaultValue;
  }
  return newObject;
};
