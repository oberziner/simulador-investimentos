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
  'Tesouro IPCA+': {
    '2024-08-15': [],
    '2026-08-15': [],
    '2035-05-15': [],
    '2045-05-15': [],
  },
  'Tesouro Prefixado': {
    '2023-01-01': [],
    '2026-01-01': [],
  },
  'Tesouro Selic': {
    '2025-03-01': [],
  },
};

rl.on('line', (input) => {
  const values = input.split(';');
  const tipo = values[0];
  const vencimento = parseDate(values[1]);
  const date = parseDate(values[2]);
  const ttipo = data[tipo];
  if (ttipo) {
    const array = ttipo[vencimento];
    if (array) {
      const buyTax = values[3].replace(',', '.');
      const sellTax = values[4].replace(',', '.');
      const object = {
        date,
        buyTax,
        sellTax,
      };
      array.push(object);
    }
  }
});

rl.on('close', () => {
  Object.keys(data).forEach((tipo) => {
    Object.keys(data[tipo]).forEach((titulo) => {
      data[tipo][titulo].sort((a, b) => (a.date > b.date ? 1 : -1));
    });
  });
  fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
});
