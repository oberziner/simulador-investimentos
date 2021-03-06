import datesAndTaxesJSON from './dates-and-taxes.json';
import ipcaJSON from './ipca.json';
import projectedIpcaJSON from './projected_ipca.json';
import tesouroIPCARatesJSON from './tesouro_ipca_rates.json';
import {
  getNextDay,
  getPreviousDay,
  isBusinessDay,
} from '../simulation/dates';

const ipcaRepo = {
  data: ipcaJSON.map((i) => {
    const date = new Date(i.date);
    return {
      date,
      ipca: i.ipca / 100,
    };
  }),
  lastHistoricalDate: new Date('2020-04-15'),
};

const projectedIpcaRepo = {
  data: projectedIpcaJSON.map((i) => {
    const date = new Date(i.date);
    return {
      date,
      projectedIpca: i.projectedIpca / 100,
    };
  }),
  lastHistoricalDate: new Date(projectedIpcaJSON[projectedIpcaJSON.length - 1].date),
};

const parseTesouroRates = (tesouroValues) => ({
  data: tesouroValues.map((i) => {
    const date = new Date(i.date);
    return {
      date,
      buyTax: +i.buyTax / 100,
      sellTax: +i.sellTax / 100,
    };
  }),
  lastHistoricalDate: new Date(tesouroValues[tesouroValues.length - 1].date),
});

const tesouroRatesRepo = {
  ipca2024: parseTesouroRates(tesouroIPCARatesJSON['Tesouro IPCA+']['2024-08-15']),
  pfix2023: parseTesouroRates(tesouroIPCARatesJSON['Tesouro Prefixado']['2023-01-01']),
  slic2025: parseTesouroRates(tesouroIPCARatesJSON['Tesouro Selic']['2025-03-01']),
};

const initializeRepository = (sourceJson) => {
  const dates = sourceJson.map((i) => {
    const date = new Date(i.date);
    return {
      date,
      selic: {
        dailyRate: () => +i.dailySelic,
        yearlyRate: () => +i.yearlySelic,
      },
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

const selicRepo = initializeRepository(datesAndTaxesJSON);

export const indexOfDate = (date, returnBeforeAfter, optionalRepository) => {
  const repository = optionalRepository || selicRepo;
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

export const findDate = (date, optionalRepository) => {
  const repository = optionalRepository || selicRepo;
  const idx = indexOfDate(date, 0, repository);
  return idx > -1 ? repository.data[idx] : null;
};

export const nextBusinessday = (date) => {
  const nextDay = getNextDay(date);
  const idx = indexOfDate(nextDay, 1, selicRepo);
  return idx > -1 ? selicRepo.data[idx] : null;
};

export const findDateOrPreviousDate = (date, optionalRepository) => {
  const repository = optionalRepository || selicRepo;
  const idx = indexOfDate(date, -1, repository);
  return idx > -1 ? repository.data[idx] : null;
};

export const getPreviousBusinessDayRates = (date) => {
  const idx = indexOfLatestDateBefore(getPreviousDay(date));
  return idx > -1 ? selicRepo.data[idx] : null;
};

export const differenceBusinessDays = (dateFrom, dateTo) => {
  const dateFromIdx = indexOfEarliestDateAfter(dateFrom);
  const dateToIdx = indexOfEarliestDateAfter(dateTo);
  return dateToIdx - dateFromIdx;
};

export const newRepositoryWithProjectedValues = (defaultValues) => ({
  getSelicForDate: (date) => {
    const obj = findDate(date);
    if (obj) {
      if (date > selicRepo.lastHistoricalDate) {
        return defaultValues.selic;
      }
      return obj.selic;
    }
    return null;
  },

  getSelicForPreviousBusinessDay: (date) => {
    const obj = getPreviousBusinessDayRates(date);
    if (obj) {
      if (obj.date > selicRepo.lastHistoricalDate) {
        return defaultValues.selic;
      }
      return obj.selic;
    }
    return null;
  },

  getIPCAForDate: (date) => {
    const obj = findDate(date, ipcaRepo);
    if (obj) {
      return obj.ipca;
    }
    if ((date > ipcaRepo.lastHistoricalDate) && (date.getUTCDate() === 1)) {
      return defaultValues.ipca;
    }
    return null;
  },

  getProjectedIPCAForDate: (date) => {
    const obj = findDate(date, projectedIpcaRepo);
    if (obj) {
      return obj.projectedIpca;
    }
    if (date > projectedIpcaRepo.lastHistoricalDate && isBusinessDay(date)) {
      return defaultValues.projectedIpca;
    }
    return null;
  },

  getTesouroTaxes: (tesouroId, date) => {
    if (!tesouroRatesRepo[tesouroId]) {
      throw new Error(`Invalid tesouro id "${tesouroId}"`);
    }
    if (date > tesouroRatesRepo[tesouroId].lastHistoricalDate) {
      if (!defaultValues[tesouroId]) {
        throw new Error(`tesouro id "${tesouroId}" not present on default values`);
      }
      return defaultValues[tesouroId];
    }
    const obj = findDateOrPreviousDate(date, tesouroRatesRepo[tesouroId]);
    if (obj) {
      return {
        buyTax: obj.buyTax,
        sellTax: obj.sellTax,
      };
    }
    return null;
  },

});
