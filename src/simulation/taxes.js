export const calculateIncomeTax = (value, days) => {
  let percentTax = 0;
  if (days <= 180) {
    percentTax = 22.5;
  } else if (days <= 360) {
    percentTax = 20;
  } else if (days <= 720) {
    percentTax = 17.5;
  } else {
    percentTax = 15;
  }
  return value * (percentTax / 100);
};
