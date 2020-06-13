import f from './sequence-factory';
import {
  newDateGenerator,
  newInterestCalculator,
  newInterestCalculatorNominalValue,
  newNominalValueProjector,
  newCustodyFeeCalculator,
  newAdjusmentFactorCalculator,
  newValueAdjuster,
} from './investment-rules';
import { differenceDays } from './dates';
import { findDate, newRepositoryWithProjectedValues } from '../repositories/dates-and-taxes';
import { calculateIncomeTax } from './taxes';
import { newRate } from './interest-rates';

const newTesouroSeq = (dateGenerator,
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

const nominalValueFromBuyPrice = (startDate, endDate, initialValue, buyPremium, yearlySelic) => {
  const adjusmentFactorCalculator = newAdjusmentFactorCalculator(endDate, {
    getAdjustmentRate: () => buyPremium,
  });
  const { adjustmentFactor } = adjusmentFactorCalculator({ date: startDate });
  const projectedNominalValue = initialValue / adjustmentFactor;
  const metaSelicDiaria = newRate((1 * yearlySelic + 0.1) / 100, 'year252');
  return projectedNominalValue / (metaSelicDiaria.dailyRate() + 1);
};

export const newTesouro = (startDate, initialValue, rate, endDate, sellingDate,
  buyTax, sellRate) => {
  const repof = newRepositoryWithProjectedValues({
    selic: {
      dailyRate: () => rate.dailyRate() + 1,
      yearlyRate: () => rate.yearly252Rate() * 100,
    },
  });

  const repo = {
    getSelicForDate: repof.getSelicForDate,
    getSelicForPreviousBusinessDay: repof.getSelicForPreviousBusinessDay,

    getDailyRate: (date) => repof.getSelicForDate(date).dailyRate(),
    getAdjustmentRate: (date) => {
      const obj = findDate(date);
      if (obj && obj.sellSelicTax) {
        return obj.sellSelicTax;
      }
      return sellRate;
    },
  };

  const yearlyRate = repof.getSelicForPreviousBusinessDay(startDate).yearlyRate();
  const nominalValue = nominalValueFromBuyPrice(startDate,
    endDate, initialValue, buyTax, yearlyRate);

  const seq = newTesouroSeq(
    newDateGenerator(startDate),
    newInterestCalculator(nominalValue, repo),
    newInterestCalculatorNominalValue(nominalValue, repo),
    newNominalValueProjector(repo),
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
    buyTax,
    totalTaxes,
    grossValue,
    netValue,
    totalDays,
    totalCustodyFee,
    steps,
  };
};
