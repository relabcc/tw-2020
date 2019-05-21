const fs = require('fs');
const path = require('path');
const glob = require('glob');
const XmlStream = require('xml-stream');
const inspect = require('util').inspect;
const subYears = require('date-fns/sub_years');
const lastDayOfYear = require('date-fns/last_day_of_year');
const lastDayOfQuarter = require('date-fns/last_day_of_quarter');
const lastDayOfMonth = require('date-fns/last_day_of_month');
const format = require('date-fns/format');
// const sampleSize = require('lodash/sampleSize');
const mapKeys = require('lodash/mapKeys');
const regression = require('regression');

const allData = [];
const getDateTransformer = id => dateString => {
  const c = id.slice(-1);
  let d = lastDayOfYear(new Date(dateString, 0));
  if (c === 'Q') {
    const [y, q] = dateString.split('Q');
    d = lastDayOfQuarter(new Date(y, (q * 3) - 1));
  }
  if (c === 'M') {
    const [y, m] = dateString.split('M');
    d = lastDayOfMonth(new Date(y, m - 1));
  }
  return format(d, 'YYYY-MM-DD');
};

const parseTrend = datasets => nearY => {
  const last = datasets[datasets.length - 1];
  let startIndex = datasets.findIndex(d => new Date(d.date) > subYears(last.date, nearY)) - 1;
  const notEnough = startIndex === -1;
  if (notEnough) startIndex = 0;
  // let prev = datasets[startIndex].value;
  // console.log(datasets[startIndex].date, '-', last.date);
  const subSet = datasets.slice(startIndex);
  const result = regression.linear(subSet.map((d, i) => [i, d.value]));
  const gradient = result.equation[0];
  const yIntercept = result.equation[1];
  return {
    startIndex,
    gradient,
    yIntercept,
    r2: result.r2,
    notEnough,
  };
};

const handleFile = (file, i, { length }) => new Promise((res, rej) => {
  const data = {};
  const datasets = [];
  const stream = fs.createReadStream(file);
  const xml = new XmlStream(stream, 'utf16le');
  let dt;
  let tableName;
  xml.collect('SeriesProperty');
  xml.collect('Obs');
  xml.on('endElement: Table', (node) => {
    Object.assign(data, mapKeys(node.$, (v, k) => k.toLowerCase()));
    dt = getDateTransformer(data.id);
  });
  xml.on('endElement: Series', (node) => {
    tableName = node.$.ITEM;
    const values = node.SeriesProperty[0].Obs.map((o) => {
      const value = parseFloat(o.$.OBS_VALUE);
      // if (isNaN(value)) {
      //   console.log(file, tableName, o.$)
      // }
      return {
        date: dt(o.$.TIME_PERIOD),
        value,
      };
    }).filter(({ value }) => !isNaN(value));
    // if (values.some((v) => isNaN(v.value))) console.log(file, tableName, values)
    datasets.push({
      name: tableName,
      values,
    });
    const trend = parseTrend(values);
    allData.push({
      ...data,
      index: datasets.length - 1,
      tableName,
      ...trend(20),
      // trends: [5, 10, 20].map(years => ({
      //   years,
      //   trend: trend(years),
      // })),
    });
  });
  xml.on('end', () => {
    // console.log(inspect(datasets, { depth: Infinity }));
    // console.log(inspect(allData, { depth: Infinity }));
    fs.writeFile(path.resolve(__dirname, `./static/data/${data.id}.json`), JSON.stringify({
      ...data,
      datasets,
    }), error => {
      if (error) {
        console.error(error);
        rej(error);
      }
      console.log(i, 'of', length, 'saved');
      res(data.name);
    });
  });
});
// handleFile(path.join(__dirname, './xml/ES0107A2Q.xml'), 1, [1])
glob(path.resolve(__dirname, './xml/*.xml'), (err, list) => Promise.all(list.map(handleFile)).then(() => {
  fs.writeFile(path.resolve(__dirname, './src/allData.json'), JSON.stringify(allData), (error) => {
    if (error) console.error(error);
    console.log('done');
  })
}));
