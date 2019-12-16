import f from './sequence-factory';
import {
  newDateGenerator,
  newInterestCalculator,
  newCustodyFeeCalculator,
  newElapsedDaysCalculator,
} from './investment-rules';
import { differenceDays } from './dates';
import { calculateIncomeTax } from './taxes';
import { newRate } from './interest-rates';

const newTesouroSeq = (dateGenerator, interestGenerator,
  custodyFeeCalculator, elapsedDaysCalculator) => f.newSequence(
  (prev) => {
    const elapsedDaysCalculated = elapsedDaysCalculator(prev);
    const nextDayCalculated = dateGenerator(elapsedDaysCalculated);
    const interestCalculated = interestGenerator(nextDayCalculated);
    const custodyFeeAdded = custodyFeeCalculator(interestCalculated);

    return custodyFeeAdded;
  },
);

export const newTesouro = (startDate, initialValue, rate, endDate) => {
  const seq = newTesouroSeq(
    newDateGenerator(startDate),
    newInterestCalculator(initialValue, rate),
    newCustodyFeeCalculator(newRate(0.0025, 'year364')),
    newElapsedDaysCalculator(),
  );

  const steps = [];

  for (let i = seq.next(); ((i.date < endDate)); i = seq.next()) {
    steps.push(i);
  }

  const totalDays = differenceDays(startDate, endDate) - 1;
  const totalTaxes = calculateIncomeTax(steps[steps.length - 1].value - steps[0].value, totalDays);
  const totalCustodyFee = steps.reduce((total, i) => total + i.custodyFee, 0);

  return {
    title: 'Tesouro Direto',
    startDate,
    endDate,
    initialValue,
    totalTaxes,
    totalDays,
    totalCustodyFee,
    steps,
  };
};
