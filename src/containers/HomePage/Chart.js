import React, { createElement } from 'react';
import get from 'lodash/get';
import format from 'date-fns/format';

import Box from '../../components/Box';
import LineChart from '../../components/LineChart';

import withData from '../../services/api/withData'

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

const Chart = ({
  data,
  row: { id, index, startIndex, linearEquation, exponentialEquation },
  regressionType,
}) => {
  const seri = get(data, [id, 'datasets', index, 'values']);
  if (seri && seri.length) {
    return <Box p="25px">
      <LineChart
        width={300}
        height={150}
        data={seri}
        startIndex={startIndex}
        linearEquation={linearEquation}
        exponentialEquation={exponentialEquation}
        regressionType={regressionType}
        dateFormater={getDateTransformer(id)}
      />
    </Box>
  }
  return null;
};

export default (props) =>
  createElement(withData('data', `${props.row.id}.json`, true)(Chart), props);
