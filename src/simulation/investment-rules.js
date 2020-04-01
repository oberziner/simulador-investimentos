import { getNextDay, isBusinessDay, differenceDays, differenceBusinessDays } from './dates';

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

export const newInterestCalculator = (defaultValue, rate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);

  if (prev.value) {
    if (isBusinessDay(newObject.date)) {
      let actualRate = rate.dailyRate() + 1;
      if (ratesRepo) {
        const obj = ratesRepo.find(prev.date);
        if (obj && obj.dailySelic) {
          actualRate = obj.dailySelic;
        }
      }
      newObject.value = trunc(newObject.value * actualRate, 6);
    }
  } else {
    newObject.value = defaultValue;
  }
  return newObject;
};

export const newInterestCalculatorNominalValue = (defaultValue, rate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);

  if (prev.nominalValue) {
    if (isBusinessDay(newObject.date)) {
      let actualRate = rate.dailyRate() + 1;
      if (ratesRepo) {
        const obj = ratesRepo.find(newObject.date);
        if (obj && obj.dailySelic) {
          actualRate = obj.dailySelic;
        }
      }
      newObject.nominalValue = trunc(newObject.nominalValue * actualRate, 6);
    }
  } else {
    newObject.nominalValue = defaultValue;
  }
  return newObject;
};

export const newCustodyFeeCalculator = (initialDate, rate) => (prev) => {
  const newObject = Object.assign({}, prev);
  const shouldCalculateFee = differenceDays(initialDate, newObject.date) > 1;
  if (('value' in newObject) && shouldCalculateFee) {
    newObject.custodyFee = newObject.value * rate.dailyRate();
  } else {
    newObject.custodyFee = 0;
  }
  return newObject;
};

export const newAdjusmentFactorCalculator = (adjustmentRate, endDate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  let businessDays = differenceBusinessDays(prev.date, endDate);
  // TODO test this if
  if (!isBusinessDay(prev.date)) {
    businessDays += 1;
  }
  let actualRate = adjustmentRate + 1;
  if (ratesRepo) {
    const obj = ratesRepo.find(newObject.date);
    if (obj && obj.sellSelicTax) {
      actualRate = obj.sellSelicTax + 1;
    }
  }
  newObject.businessDays = businessDays;
  newObject.adjustmentFactor = trunc(100
    / (actualRate ** trunc(businessDays / 252, 14)), 4) / 100;

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
