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
  valueAdjuster,
  nominalValue) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const adjusmentFactorCalculated = adjusmentFactorCalculator(nextDayCalculated);
    const custodyFeeAdded = custodyFeeCalculator(adjusmentFactorCalculated);
    custodyFeeAdded.projectedNominalValue = nominalValue;
    const adjustedValue = valueAdjuster(custodyFeeAdded);

    return adjustedValue;
  },
);

const nominalValueFromBuyPrice = (startDate, endDate, initialValue, buyPremium) => {
  const adjusmentFactorCalculator = newAdjusmentFactorCalculator(endDate, {
    getAdjustmentRate: () => buyPremium,
  });
  const { adjustmentFactor } = adjusmentFactorCalculator({ date: startDate });
  const projectedNominalValue = initialValue / adjustmentFactor;

  return projectedNominalValue;
};

export const newTesouroPrefixado = (startDate, initialValue, rate, endDate, sellingDate,
  buyRate, sellRate) => {
  const repof = newRepositoryWithProjectedValues({
    pfix2023: {
      buyTax: buyRate,
      sellTax: sellRate,
    },
  });

  const repo = {
    getAdjustmentRate: (date) => {
      const obj = repof.getTesouroTaxes('pfix2023', date);
      return obj.sellTax / 100;
    },
  };

  const buyTax = repof.getTesouroTaxes('pfix2023', startDate).buyTax / 100;
  const nominalValue = nominalValueFromBuyPrice(startDate, endDate, initialValue, buyTax);

  const seq = newTesouroSeq(
    newDateGenerator(startDate),
    newCustodyFeeCalculator(startDate, newRate(0.0025, 'year365')),
    newAdjusmentFactorCalculator(endDate, repo),
    newValueAdjuster(),
    nominalValue,
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
    title: 'Tesouro Direto Prefixado',
    startDate,
    endDate: sellingDate,
    dueDate: endDate,
    initialValue,
    buyTax,
    totalTaxes,
    grossValue,
    nominalValue,
    netValue,
    totalDays,
    totalCustodyFee,
    steps,
  };
};
