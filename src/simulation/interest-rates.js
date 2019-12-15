const validPeriods = ['day', 'month', 'year252', 'year364'];

export const newRate = (rate, period) => {
  if (validPeriods.indexOf(period) < 0) {
    throw new Error(`Invalid period "${period}". Period should be one of ${validPeriods}`);
  }
  return {
    rate,
    period,
    dailyRate: () => {
      switch (period) {
        case 'day': return rate;
        case 'month': return ((1 + rate) ** (1 / 30)) - 1;
        case 'year252': return ((1 + rate) ** (1 / 252)) - 1;
        case 'year364': return ((1 + rate) ** (1 / 364)) - 1;
        default: throw new Error('Invalid period');
      }
    },

    monthlyRate: () => {
      switch (period) {
        case 'day': return ((1 + rate) ** 30) - 1;
        case 'month': return rate;
        case 'year252': return ((1 + rate) ** (1 / 12)) - 1;
        case 'year364': return ((1 + rate) ** (1 / 12)) - 1;
        default: throw new Error('Invalid period');
      }
    },

    yearly252Rate: () => {
      switch (period) {
        case 'day': return ((1 + rate) ** 252) - 1;
        case 'month': return ((1 + rate) ** 12) - 1;
        case 'year252': return rate;
        case 'year364': throw new Error('Cannot convert year364 rate to year252 rate');
        default: throw new Error('Invalid period');
      }
    },
    yearly364Rate: () => {
      switch (period) {
        case 'day': return ((1 + rate) ** 364) - 1;
        case 'month': return ((1 + rate) ** 12) - 1;
        case 'year252': throw new Error('Cannot convert year252 rate to year364 rate');
        case 'year364': return rate;
        default: throw new Error('Invalid period');
      }
    },
  };
};
