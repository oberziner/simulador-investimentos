import { getNextDay, isBusinessDay, differenceDays, previousDateWithDayOfMonth, nextDateWithDayOfMonth } from './dates';
import { differenceBusinessDays, nextBusinessday } from '../repositories/dates-and-taxes';
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

export const newInterestCalculator = (defaultValue, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { value, date } = newObject;

  if (value) {
    if (isBusinessDay(date)) {
      const actualRate = ratesRepo.getDailyRate(date);
      newObject.value = trunc(value * actualRate, 6);
      newObject.usedRate = actualRate;
    }
  } else {
    newObject.value = defaultValue;
  }
  return newObject;
};

export const newInterestCalculatorNominalValue = (defaultValue, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { nominalValue, date } = newObject;

  if (nominalValue) {
    if (isBusinessDay(date)) {
      const actualRate = ratesRepo.getSelicForPreviousBusinessDay(date).dailyRate();
      newObject.nominalValue = trunc(nominalValue * actualRate, 6);
    }
  } else {
    newObject.nominalValue = defaultValue;
  }
  return newObject;
};

// TODO: NEEDS TEST
export const newInflationCalculatorNominalValue = (defaultValue, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { nominalValue, date } = newObject;

  if (nominalValue) {
    const actualRate = ratesRepo.getIPCAForDate(date);
    if (actualRate) {
      newObject.nominalValue = trunc(nominalValue * (1 + actualRate), 6);
    }
  } else {
    newObject.nominalValue = defaultValue;
  }
  return newObject;
};

// TODO: NEEDS TEST
export const newNominalValueProjector = (ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { nominalValue, date } = newObject;

  if (nominalValue) {
    let selic = ratesRepo.getSelicForDate(date);

    if (!selic) {
      selic = ratesRepo.getSelicForPreviousBusinessDay(date);
    }
    if (!selic) {
      throw new Error(`Could not find selicTarget for ${date}`);
    }

    const yearlySelic = selic.yearlyRate();
    const selicTarget = newRate(yearlySelic / 100 + 0.001, 'year252');
    newObject.projectedNominalValue = trunc(nominalValue * (selicTarget.dailyRate() + 1), 6);
  } else {
    throw new Error(`object should have nominalValue: ${JSON.stringify(prev)}`);
  }
  return newObject;
};

// TODO: NEEDS TEST
export const newIPCANominalValueProjector = (ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { nominalValue, date } = newObject;

  if (nominalValue) {
    const liquidationDate = nextBusinessday(date).date;
    const previousIPCADate = previousDateWithDayOfMonth(liquidationDate, 15);
    const nextIPCADate = nextDateWithDayOfMonth(liquidationDate, 15);
    const daysSinceLastIPCADate = differenceDays(previousIPCADate, liquidationDate);
    const daysBetweenLastIPCADateAndNextIPCADate = differenceDays(previousIPCADate, nextIPCADate);
    const projectedIpca = ratesRepo.getProjectedIPCAForDate(date);

    newObject.projectedIpca = projectedIpca;
    newObject.daysSinceLastIPCADate = daysSinceLastIPCADate;
    newObject.daysBetweenLastIPCADateAndNextIPCADate = daysBetweenLastIPCADateAndNextIPCADate;

    if (projectedIpca) {
      newObject.projectedNominalValue = nominalValue
        * (1 + projectedIpca) ** (daysSinceLastIPCADate / daysBetweenLastIPCADateAndNextIPCADate);
    } else {
      newObject.projectedNominalValue = nominalValue;
    }
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

export const newAdjusmentFactorCalculator = (endDate, ratesRepo) => (prev) => {
  const newObject = Object.assign({}, prev);
  const { date } = newObject;

  const businessDays = differenceBusinessDays(date, endDate) - 1;
  const actualRate = ratesRepo.getAdjustmentRate(date) + 1;

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
