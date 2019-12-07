const addZero = (n) => (n < 10 ? `0${n}` : n);

export default {
  formatDate: (d) => `${d.getUTCFullYear()}-${addZero(d.getUTCMonth() + 1)}-${addZero(d.getUTCDate())}`,
};
