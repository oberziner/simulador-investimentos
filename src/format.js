const addZero = (n) => (n < 10 ? `0${n}` : n);

const formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default {
  formatDate: (d) => `${d.getUTCFullYear()}-${addZero(d.getUTCMonth() + 1)}-${addZero(d.getUTCDate())}`,
  formatMoney: formatter.format,
};
