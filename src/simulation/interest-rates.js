const validPeriods = ['day', 'month', 'year'];

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
        case 'year': return ((1 + rate) ** (1 / 252)) - 1;
        default: throw new Error('Invalid period');
      }
    },

    monthlyRate: () => {
      switch (period) {
        case 'day': return ((1 + rate) ** 30) - 1;
        case 'month': return rate;
        case 'year': return ((1 + rate) ** (1 / 12)) - 1;
        default: throw new Error('Invalid period');
      }
    },

    yearlyRate: () => {
      switch (period) {
        case 'day': return ((1 + rate) ** 252) - 1;
        case 'month': return ((1 + rate) ** 12) - 1;
        case 'year': return rate;
        default: throw new Error('Invalid period');
      }
    },
  };
};
