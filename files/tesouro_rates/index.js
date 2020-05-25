const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('PrecoTaxaTesouroDireto.csv');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

const data = {
  ipca: [],
  prefixado: [],
};

rl.on('line', (input) => {
  const values = input.split(';');
  const tipo = values[0];
  const vencimento = parseDate(values[1]);
  const date = parseDate(values[2]);
  if ((tipo === 'Tesouro IPCA+') && (vencimento === '2024-08-15') && (date > '2019')) {
    const buyTax = values[3].replace(',', '.');
    const sellTax = values[4].replace(',', '.');
    const object = {
      date,
      buyTax,
      sellTax,
    };
    data.ipca.push(object);
  }
  if ((tipo === 'Tesouro Prefixado') && (vencimento === '2023-01-01') && (date > '2019')) {
    const buyTax = values[3].replace(',', '.');
    const sellTax = values[4].replace(',', '.');
    const object = {
      date,
      buyTax,
      sellTax,
    };
    data.prefixado.push(object);
  }
});

rl.on('close', () => {
  data.ipca.sort((a, b) => (a.date > b.date ? 1 : -1));
  data.prefixado.sort((a, b) => (a.date > b.date ? 1 : -1));
  fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
});
