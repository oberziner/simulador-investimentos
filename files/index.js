/* eslint no-console: "off", import/no-unresolved: "off",
  prefer-template: "off", import/no-extraneous-dependencies: "off" */

const nodeXls = require('xls-to-json');
const fs = require('fs');

nodeXls({
  input: 'feriados_nacionais.xls', // input xls
  output: null, // output json
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    const data = {};
    result.map((i) => {
      const values = i.Data.split('/');
      return { date: new Date('20' + values[2], values[0] - 1, values[1]) };
    })
      .filter((d) => !Number.isNaN(d.date.getTime()))
      .forEach((i) => { data[i.date.toISOString().substring(0, 10)] = true; });
    console.log(data);
    fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
  }
});
