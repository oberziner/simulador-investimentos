const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('anbima_projected_ipca_full.csv');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

const parseDate = (dateStr) => {
  const [month, day, year] = dateStr.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

const data = [];

rl.on('line', (input) => {
  const values = input.split(';');
  const date = parseDate(values[0]);
  const projectedIpca = values[1];
  const object = {
    date,
    projectedIpca,
  };
  // eslint-disable-next-line no-console
  data.push(object);
//  console.log(`${JSON.stringify(object)},`);
});

rl.on('close', () => {
  // eslint-disable-next-line no-console
  fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
});
