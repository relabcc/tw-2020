const fs = require('fs');
const source = require('./src/allData.json');

const header = Object.keys(source[0]);

const csv = `${header.join()}\n${source.map(d => header.map(h => d[h]).join()).join('\n')}`;

fs.writeFile('./allData.csv', csv, (err) => {
  if (err) console.error(err);
  console.log('done');
})
