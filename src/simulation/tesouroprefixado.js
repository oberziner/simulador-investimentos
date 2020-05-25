import f from './sequence-factory';
import {
  newDateGenerator,
  newCustodyFeeCalculator,
  newAdjusmentFactorCalculator,
  newValueAdjuster,
} from './investment-rules';
import { differenceDays } from './dates';
import { newRepositoryWithProjectedValues } from '../repositories/dates-and-taxes';
import { calculateIncomeTax } from './taxes';
import { newRate } from './interest-rates';

const newTesouroSeq = (dateGenerator,
  custodyFeeCalculator,
  adjusmentFactorCalculator,
  valueAdjuster) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const adjusmentFactorCalculated = adjusmentFactorCalculator(nextDayCalculated);
    const custodyFeeAdded = custodyFeeCalculator(adjusmentFactorCalculated);
    custodyFeeAdded.projectedNominalValue = 1000; // Tesouro Prefixado nominal value is always 1000
    const adjustedValue = valueAdjuster(custodyFeeAdded);

    return adjustedValue;
  },
);

export const newTesouroPrefixado = (startDate, initialValue, rate, endDate, sellingDate) => {
  const repof = newRepositoryWithProjectedValues({
    selic: {
      dailyRate: () => rate.dailyRate() + 1,
      yearlyRate: () => rate.yearly252Rate() * 100,
    },
  });

  const repo = {
    getAdjustmentRate: (date) => {
      const obj = repof.getTesouroPrefixadoTaxes(date);
      return obj.sellTax / 100;
    },
  };

  const nominalValue = 1000;

  const seq = newTesouroSeq(
    newDateGenerator(startDate),
    newCustodyFeeCalculator(startDate, newRate(0.0025, 'year365')),
    newAdjusmentFactorCalculator(endDate, repo),
    newValueAdjuster(),
  );

  const steps = [];

  for (let i = seq.next(); ((i.date <= sellingDate)); i = seq.next()) {
    steps.push(i);
  }

  const grossValue = steps[steps.length - 1].value;
  const totalDays = differenceDays(startDate, sellingDate) - 1;
  const totalTaxes = calculateIncomeTax(steps[steps.length - 1].value - initialValue, totalDays);
  const totalCustodyFee = steps.reduce((total, i) => total + i.custodyFee, 0);
  const netValue = grossValue - totalTaxes - totalCustodyFee;

  return {
    title: `Tesouro Direto ${rate.toString()}`,
    startDate,
    endDate: sellingDate,
    dueDate: endDate,
    initialValue,
    totalTaxes,
    grossValue,
    nominalValue,
    netValue,
    totalDays,
    totalCustodyFee,
    steps,
  };
};
