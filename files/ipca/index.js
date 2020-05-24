const fs = require('fs');

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
};

const file = fs.readFileSync('ipca.json');
const obj = JSON.parse(file);

const result = obj.map((i) => {
  const date = parseDate(i.data);
  const ipca = +i.valor;
  return {
    date,
    ipca,
  };
});

fs.writeFileSync('output.json', JSON.stringify(result, null, 2));
