const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('selic_diaria.csv');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

rl.on('line', (input) => {
  const values = input.split(';');
  const date = parseDate(values[0]);
  const yearlySelic = values[1].replace(',', '.');
  const dailySelic = values[2].replace(',', '.');
  const object = {
    date,
    yearlySelic,
    dailySelic,
  };
  // eslint-disable-next-line no-console
  console.log(`${JSON.stringify(object)},`);
});

rl.on('close', () => {
  // eslint-disable-next-line no-console
  console.log('the end');
});
