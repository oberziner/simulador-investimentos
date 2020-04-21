import datesAndTaxesJSON from './dates-and-taxes.json';
import {
  getNextDay,
  getPreviousDay,
  isBusinessDay,
} from '../simulation/dates';

const breakDateForSelicTax = new Date('2020-02-29');

const getTesouroSelicSellTax = (date) => {
  if (date.getTime() > breakDateForSelicTax.getTime()) {
    return 0.0004;
  }
  return 0.0003;
};

const initializeRepository = (sourceJson) => {
  const dates = sourceJson.map((i) => {
    const date = new Date(i.date);
    const sellSelicTax = getTesouroSelicSellTax(date);
    return {
      date,
      yearlySelic: +i.yearlySelic,
      dailySelic: +i.dailySelic,
      sellSelicTax,
    };
  });

  const lastHistoricalDate = dates[dates.length - 1].date;
  let lastDate = lastHistoricalDate;
  const target = new Date('2078-12-31');
  while ((lastDate.getTime() - target.getTime()) < 0) {
    lastDate = getNextDay(lastDate);
    if (isBusinessDay(lastDate)) {
      dates.push({ date: lastDate });
    }
  }

  return {
    data: dates,
    lastHistoricalDate,
  };
};

const repository = initializeRepository(datesAndTaxesJSON);

export const indexOfDate = (date, returnBeforeAfter) => {
  let startIndex = 0;
  let endIndex = repository.data.length - 1;
  let loops = 0;
  while (startIndex <= endIndex) {
    loops += 1;
    if (loops > 20) {
      throw new Error(`indexOfDate failed for ${date}`);
    }
    const middleIndex = Math.floor((startIndex + endIndex) / 2);
    if (date.getTime() === repository.data[middleIndex].date.getTime()) {
      return middleIndex;
    }
    if (date.getTime() > repository.data[middleIndex].date.getTime()) {
      startIndex = middleIndex + 1;
    } else if (date.getTime() < repository.data[middleIndex].date.getTime()) {
      endIndex = middleIndex - 1;
    }
  }

  if (returnBeforeAfter < 0) {
    return endIndex;
  }
  if (returnBeforeAfter > 0) {
    return startIndex;
  }
  return -1;
};

export const indexOfLatestDateBefore = (date) => indexOfDate(date, -1);
export const indexOfEarliestDateAfter = (date) => indexOfDate(date, 1);

export const findDate = (date) => {
  const idx = indexOfDate(date);
  return idx > -1 ? repository.data[idx] : null;
};

export const getPreviousBusinessDayRates = (date) => {
  const idx = indexOfLatestDateBefore(getPreviousDay(date));
  return idx > -1 ? repository.data[idx] : null;
};

export const differenceBusinessDays = (dateFrom, dateTo) => {
  const dateFromIdx = indexOfEarliestDateAfter(dateFrom);
  const dateToIdx = indexOfEarliestDateAfter(dateTo);
  return dateToIdx - dateFromIdx;
};

export const newRepositoryWithFuture = (defaultValues) => ({
  getDailySelic: (date) => {
    const obj = findDate(date);
    if (obj) {
      if (date > repository.lastHistoricalDate) {
        return defaultValues.dailySelic
      }
      return obj.dailySelic;
    }
    return null;
  },

  getYearlySelic: (date) => {
    const obj = findDate(date);
    if (obj) {
      if (date > repository.lastHistoricalDate) {
        return defaultValues.yearlySelic
      }
      return obj.yearlySelic;
    }
    return null;
  },

  getPreviousBusinessDaySelic: (date) => {
    const obj = getPreviousBusinessDayRates(date);
    if (obj) {
      if (obj.date > repository.lastHistoricalDate) {
        return defaultValues.dailySelic
      }
      return obj.dailySelic;
    }
    return null;
  },

  getPreviousBusinessYearSelic: (date) => {
    const obj = getPreviousBusinessDayRates(date);
    if (obj) {
      if (obj.date > repository.lastHistoricalDate) {
        return defaultValues.yearlySelic
      }
      return obj.yearlySelic;
    }
    return null;
  }
})
