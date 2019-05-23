import React, { createElement } from 'react';
import get from 'lodash/get';
import format from 'date-fns/format';

import Box from '../../components/Box';
import LineChart from '../../components/LineChart';

import withData from '../../services/api/withData';

const getDateTransformer = id => d => {
  const c = id.slice(-1);
  if (c === 'Q') {
    return `${format(d, 'YYYY')}Q${format(d, 'Q')}`;
  }
  if (c === 'M') {
    return format(d, 'YYYY-MM');
  }
  return format(d, 'YYYY');
};

const getFormula = {
  linear: equation => (d, i) => ({
    ...d,
    value: equation[0] * (i + 1) + equation[1],
  }),
  exponential: equation => (d, i) => ({
    ...d,
    value: equation[0] * Math.exp(equation[1] * (i + 1)),
  }),
  logarithmic: equation => (d, i) => ({
    ...d,
    value: equation[0] + equation[1] * Math.log(i + 1),
  }),
  power: equation => (d, i) => ({
    ...d,
    value: equation[0] * (i + 1) ** equation[1],
  }),
};

const Chart = ({
  data,
  row: { id, index, startIndex, ...row },
  regressionType,
}) => {
  const seri = get(data, [id, 'datasets', index, 'values']);
  const formula = getFormula[regressionType](row[`${regressionType}Equation`]);

  if (seri && seri.length) {
    return <Box px="25px" py="1em">
      <LineChart
        width={300}
        height={100}
        data={seri}
        startIndex={startIndex}
        dateFormater={getDateTransformer(id)}
        regressionFormula={formula}
      />
    </Box>
  }
  return null;
};

export default (props) =>
  createElement(withData('data', `${props.row.id}.json`, true)(Chart), props);
