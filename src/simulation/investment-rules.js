import { getNextDay, isBusinessDay, differenceBusinessDays } from './dates';

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

export const newCustodyFeeCalculator = (rate) => (prev) => {
  const newObject = Object.assign({}, prev);
  if ('value' in newObject) {
    newObject.custodyFee = newObject.value * rate.dailyRate();
  } else {
    newObject.custodyFee = 0;
  }
  return newObject;
};

const trunc = (val, places) => {
  const tens = 10 ** places;
  return Math.trunc(val * tens) / tens;
};

export const newAdjusmentFactorCalculator = (adjustmentRate, endDate) => (prev) => {
  const newObject = Object.assign({}, prev);
  const businessDays = differenceBusinessDays(prev.date, endDate);
  newObject.businessDays = businessDays;
  newObject.adjustmentFactor = trunc(100
    / ((1 + adjustmentRate) ** trunc(businessDays / 252, 14)), 4);

  return newObject;
};
