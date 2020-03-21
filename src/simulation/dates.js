import holidays from './holidays.json';

export const getNextDay = (date) => new Date(date.getTime() + 86400000);

export const isBusinessDay = (date) => (date.getUTCDay() !== 0) // sunday
  && (date.getUTCDay() !== 6) // saturday
  && (!(date.toISOString().substring(0, 10) in holidays));

export const differenceDays = (dateFrom, dateTo) => Math.trunc(
  (dateTo - dateFrom) / 1000 / 60 / 60 / 24,
);

export const differenceBusinessDays = (dateFrom, dateTo) => {
  let date = dateFrom;
  let du = 0;
  while (date < dateTo) {
    if (isBusinessDay(date)) {
      du += 1;
    }
    date = getNextDay(date);
  }
  return du;
};
