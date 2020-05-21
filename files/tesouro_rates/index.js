/* eslint no-console: "off", import/no-unresolved: "off",
  prefer-template: "off", import/no-extraneous-dependencies: "off" */

const nodeXls = require('xls-to-json');
const fs = require('fs');

nodeXls({
  input: 'NTN-B_Principal_2020.xls', // input xls
  output: null, // output json
  rowsToSkip: 1,
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    const data = result.map((i) => {
      const values = i.Dia.split('/');
      const buyTax = i['Taxa Compra Manhã'].slice(0, -1);
      const sellTax = i['Taxa Venda Manhã'].slice(0, -1);
      return {
        date: new Date(values[2], values[1] - 1, values[0]).toISOString().substring(0, 10),
        buyTax,
        sellTax,
      };
    });
    fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
  }
});
