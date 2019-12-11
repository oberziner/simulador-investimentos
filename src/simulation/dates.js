import holidays from './holidays.json';

export const getNextDay = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

export const isBusinessDay = (date) => (date.getUTCDay() !== 0) // sunday
  && (date.getUTCDay() !== 6) // saturday
  && (!(date.toISOString().substring(0, 10) in holidays));
