import { getNextDay, isBusinessDay, differenceBusinessDays } from './dates';

const trunc = (val, places) => {
  const tens = 10 ** places;
  return Math.trunc(val * tens) / tens;
};

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
      newObject.value = trunc(newObject.value * (1 + rate.dailyRate()), 6);
    }
  } else {
    newObject.value = defaultValue;
  }
  return newObject;
};

export const newInterestCalculatorNominalValue = (defaultValue, rate) => (prev) => {
  const newObject = Object.assign({}, prev);

  if (prev.nominalValue) {
    if (isBusinessDay(newObject.date)) {
      newObject.nominalValue = trunc(newObject.nominalValue * (1 + rate.dailyRate()), 6);
    }
  } else {
    newObject.nominalValue = defaultValue;
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

export const newAdjusmentFactorCalculator = (adjustmentRate, endDate) => (prev) => {
  const newObject = Object.assign({}, prev);
  let businessDays = differenceBusinessDays(prev.date, endDate);
  // TODO test this if
  if (!isBusinessDay(prev.date)) {
    businessDays += 1;
  }
  newObject.businessDays = businessDays;
  newObject.adjustmentFactor = trunc(100
    / ((1 + adjustmentRate) ** trunc(businessDays / 252, 14)), 4) / 100;

  return newObject;
};

export const newValueAdjuster = () => (prev) => {
  const newObject = Object.assign({}, prev);
  if (newObject.adjustmentFactor != null) {
    newObject.value = newObject.nominalValue * newObject.adjustmentFactor;
  } else {
    newObject.value = newObject.nominalValue;
  }
  return newObject;
};
