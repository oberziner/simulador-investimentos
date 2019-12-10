export const getNextDay = (date) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + 1);
  return newDate;
};

const holidays = {
  '2020-01-01': true,
  '2019-03-04': true,
  '2019-03-05': true,
  '2019-04-19': true,
  '2019-05-01': true,
  '2019-06-20': true,
};

export const isBusinessDay = (date) => (date.getDay() !== 0) // sunday
  && (date.getDay() !== 6) // saturday
  && (!(date.toISOString().substring(0, 10) in holidays));
