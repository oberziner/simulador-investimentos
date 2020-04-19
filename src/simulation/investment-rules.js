import { getNextDay, isBusinessDay, differenceDays } from './dates';
import { differenceBusinessDays } from '../repositories/dates-and-taxes';
import { newRate } from './interest-rates';

const trunc = (val, places) => {
  const tens = 10 ** places;
  return Math.trunc(val * tens) / tens;
};

export const newDateGenerator = (defaultDate) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { date } = newObject;

  if (date) {
    newObject.date = getNextDay(date);
  } else {
    newObject.date = defaultDate;
  }
  return newObject;
};

export const newInterestCalculator = (defaultValue, rate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { value, date } = newObject;

  if (value) {
    if (isBusinessDay(date)) {
      let actualRate = rate.dailyRate() + 1;
      if (ratesRepo) {
        const obj = ratesRepo.find(date);
        if (obj && obj.dailySelic) {
          actualRate = obj.dailySelic;
        }
      }
      newObject.value = trunc(value * actualRate, 6);
      newObject.usedRate = actualRate;
    }
  } else {
    newObject.value = defaultValue;
  }
  return newObject;
};

export const newInterestCalculatorNominalValue = (defaultValue, rate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { nominalValue, date } = newObject;

  if (nominalValue) {
    if (isBusinessDay(date)) {
      let actualRate = rate.dailyRate() + 1;
      if (ratesRepo) {
        const obj = ratesRepo.findPreviousBusinessDay(date);
        if (obj && obj.dailySelic) {
          actualRate = obj.dailySelic;
        }
      }
      newObject.nominalValue = trunc(nominalValue * actualRate, 6);
    }
  } else {
    newObject.nominalValue = defaultValue;
  }
  return newObject;
};

export const newNominalValueProjector = (rate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { nominalValue, date } = newObject;

  if (nominalValue) {
    let selicTarget = newRate(rate.yearly252Rate() + 0.001, 'year252');
    if (ratesRepo) {
      let obj = ratesRepo.find(date);
      if (!obj) {
        obj = ratesRepo.findPreviousBusinessDay(date);
      }
      if (obj && obj.yearlySelic) {
        selicTarget = newRate((1 * obj.yearlySelic + 0.1) / 100, 'year252');
      }
    }
    newObject.projectedNominalValue = trunc(nominalValue * (selicTarget.dailyRate() + 1), 6);
  } else {
    throw new Error(`object should have nominalValue: ${JSON.stringify(prev)}`);
  }
  return newObject;
};

export const newCustodyFeeCalculator = (initialDate, rate) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { date, value } = newObject;

  const shouldCalculateFee = differenceDays(initialDate, date) > 1;
  if (('value' in newObject) && shouldCalculateFee) {
    newObject.custodyFee = trunc(value * rate.dailyRate(), 4);
    newObject.totalCustodyFee += newObject.custodyFee;
  } else {
    newObject.custodyFee = 0;
    newObject.totalCustodyFee = 0;
  }
  return newObject;
};

export const newAdjusmentFactorCalculator = (adjustmentRate, endDate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { date } = newObject;

  const businessDays = differenceBusinessDays(date, endDate) - 1;
  let actualRate = adjustmentRate + 1;
  if (ratesRepo) {
    const obj = ratesRepo.find(date);
    if (obj && obj.sellSelicTax) {
      actualRate = obj.sellSelicTax + 1;
    }
  }
  newObject.sellTax = actualRate;
  newObject.businessDays = businessDays;
  newObject.adjustmentFactor = trunc(100
    / (actualRate ** trunc(businessDays / 252, 14)) / 100, 6);

  return newObject;
};

export const newValueAdjuster = () => (prev) => {
  const newObject = Object.assign({}, prev);
  const { adjustmentFactor, projectedNominalValue } = newObject;

  if (adjustmentFactor) {
    newObject.value = trunc(projectedNominalValue * trunc(adjustmentFactor, 6), 2);
  } else {
    newObject.value = projectedNominalValue;
  }
  return newObject;
};
