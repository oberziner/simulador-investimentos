import holidays from './holidays.json';
import datesAndTaxesJSON from './dates-and-taxes.json';

const datesAndTaxes = datesAndTaxesJSON.map((i) => {
  const date = new Date(i.date);
  return {
    date,
    yearlySelic: i.yearlySelic,
    dailySelic: i.dailySelic,
  };
});

export const isBusinessDay = (date) => (date.getUTCDay() !== 0) // sunday
  && (date.getUTCDay() !== 6) // saturday
  && (!(date.toISOString().substring(0, 10) in holidays));

export const getNextDay = (date) => new Date(date.getTime() + 86400000);
export const getPreviousDay = (date) => new Date(date.getTime() - 86400000);

const initDatesAndTaxes = (datesArray) => {
  let lastDate = datesArray[datesArray.length - 1].date;
  const target = new Date('2030-12-31');
  while ((lastDate.getTime() - target.getTime()) < 0) {
    lastDate = getNextDay(lastDate);
    if (isBusinessDay(lastDate)) {
      datesArray.push({ date: lastDate });
    }
  }
};

initDatesAndTaxes(datesAndTaxes);

export const differenceDays = (dateFrom, dateTo) => Math.trunc(
  (dateTo - dateFrom) / 1000 / 60 / 60 / 24,
);

export const indexOfDate = (date, returnBeforeAfter) => {
  let startIndex = 0;
  let endIndex = datesAndTaxes.length - 1;
  let loops = 0;
  while (startIndex <= endIndex) {
    loops += 1;
    if (loops > 20) {
      throw new Error(`indexOfDate failed for ${date}`);
    }
    const middleIndex = Math.floor((startIndex + endIndex) / 2);
    if (date.getTime() === datesAndTaxes[middleIndex].date.getTime()) {
      return middleIndex;
    }
    if (date.getTime() > datesAndTaxes[middleIndex].date.getTime()) {
      startIndex = middleIndex + 1;
    } else if (date.getTime() < datesAndTaxes[middleIndex].date.getTime()) {
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
  return idx > -1 ? datesAndTaxes[idx] : null;
};

export const differenceBusinessDays = (dateFrom, dateTo) => {
  const dateFromIdx = indexOfEarliestDateAfter(dateFrom);
  const dateToIdx = indexOfEarliestDateAfter(dateTo);
  return dateToIdx - dateFromIdx;
};
