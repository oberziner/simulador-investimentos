import holidays from './holidays.json';

export const isBusinessDay = (date) => (date.getUTCDay() !== 0) // sunday
  && (date.getUTCDay() !== 6) // saturday
  && (!(date.toISOString().substring(0, 10) in holidays));

export const differenceDays = (dateFrom, dateTo) => Math.trunc(
  (dateTo.getTime() - dateFrom.getTime()) / 1000 / 60 / 60 / 24,
);

export const getNextDay = (date) => new Date(date.getTime() + 86400000);
export const getPreviousDay = (date) => new Date(date.getTime() - 86400000);

export const previousDateWithDayOfMonth = (date, day) => {
  if (day < date.getUTCDate()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), day));
  }
  if (date.getUTCMonth() > 0) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() - 1, day));
  }
  return new Date(Date.UTC(date.getUTCFullYear() - 1, 11, day, 0));
};

export const nextDateWithDayOfMonth = (date, day) => {
  if (day >= date.getUTCDate()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), day));
  }
  if (date.getUTCMonth() < 11) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, day));
  }
  return new Date(Date.UTC(date.getUTCFullYear() + 1, 0, day, 0));
};
