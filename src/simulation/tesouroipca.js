import f from './sequence-factory';
import {
  newDateGenerator,
  newInterestCalculator,
  newInflationCalculatorNominalValue,
  newIPCANominalValueProjector,
  newCustodyFeeCalculator,
  newAdjusmentFactorCalculator,
  newValueAdjuster,
} from './investment-rules';
import { differenceDays, previousDateWithDayOfMonth, nextDateWithDayOfMonth } from './dates';
import { newRepositoryWithProjectedValues } from '../repositories/dates-and-taxes';
import { calculateIncomeTax } from './taxes';
import { newRate } from './interest-rates';

const newTesouroIPCASeq = (dateGenerator,
  interestGenerator,
  interestGeneratorNominalValue,
  nominalValueProjector,
  custodyFeeCalculator,
  adjusmentFactorCalculator,
  valueAdjuster) => f.newSequence(
  (prev) => {
    const nextDayCalculated = dateGenerator(prev);
    const interestCalculatedNominalValue = interestGeneratorNominalValue(nextDayCalculated);
    const nominalValueProjected = nominalValueProjector(interestCalculatedNominalValue);
    const interestCalculated = interestGenerator(nominalValueProjected);
    const adjusmentFactorCalculated = adjusmentFactorCalculator(interestCalculated);
    const custodyFeeAdded = custodyFeeCalculator(adjusmentFactorCalculated);
    const adjustedValue = valueAdjuster(custodyFeeAdded);

    return adjustedValue;
  },
);

const nominalValueFromBuyPrice = (startDate, endDate, initialValue, buyPremium, projectedIPCA) => {
  const adjusmentFactorCalculator = newAdjusmentFactorCalculator(endDate, {
    getAdjustmentRate: () => buyPremium,
  });
  const { adjustmentFactor } = adjusmentFactorCalculator({ date: startDate });
  const projectedNominalValue = initialValue / adjustmentFactor;

  const previousIPCADate = previousDateWithDayOfMonth(startDate, 15);
  const nextIPCADate = nextDateWithDayOfMonth(startDate, 15);
  const daysSinceLastIPCADate = differenceDays(previousIPCADate, startDate) + 1;
  const daysBetweenLastIPCADateAndNextIPCADate = differenceDays(previousIPCADate, nextIPCADate);

  const vna = projectedNominalValue
    / (1 + projectedIPCA) ** (daysSinceLastIPCADate / daysBetweenLastIPCADateAndNextIPCADate);

  return vna;
};

export const newTesouroIPCA = (startDate, initialValue, rate, endDate, sellingDate,
  buyRate, sellRate) => {
  // TODO handle startDate not being business day
  const repof = newRepositoryWithProjectedValues({
    selic: {
      dailyRate: () => rate.dailyRate() + 1,
      yearlyRate: () => rate.yearly252Rate() * 100,
    },
    buyTax: buyRate,
    sellTax: sellRate,
    ipca: rate.monthlyRate(),
    projectedIpca: rate.monthlyRate(),
  });

  const repo = {
    getSelicForDate: repof.getSelicForDate,
    getSelicForPreviousBusinessDay: repof.getSelicForPreviousBusinessDay,
    getIPCAForDate: repof.getIPCAForDate,
    getProjectedIPCAForDate: repof.getProjectedIPCAForDate,

    getDailyRate: (date) => repof.getSelicForDate(date).dailyRate(),
    getAdjustmentRate: (date) => {
      const obj = repof.getTesouroIPCATaxes(date);
      return obj.sellTax / 100;
    },
  };

  const buyTax = repof.getTesouroIPCATaxes(startDate).buyTax / 100;
  const nominalValue = nominalValueFromBuyPrice(startDate,
    endDate,
    initialValue,
    buyTax,
    repof.getProjectedIPCAForDate(startDate));

  const seq = newTesouroIPCASeq(
    newDateGenerator(startDate),
    newInterestCalculator(nominalValue, repo),
    newInflationCalculatorNominalValue(nominalValue, repo),
    newIPCANominalValueProjector(repo),
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
    title: `Tesouro Direto IPCA ${rate.toString()}`,
    startDate,
    nominalValue,
    endDate: sellingDate,
    dueDate: endDate,
    initialValue,
    buyTax,
    totalTaxes,
    grossValue,
    netValue,
    totalDays,
    totalCustodyFee,
    steps,
  };
};
