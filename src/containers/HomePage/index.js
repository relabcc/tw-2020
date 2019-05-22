import React, { PureComponent } from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import get from 'lodash/get';

import Layout from '../Layout';
import Box from '../../components/Box'
import Text from '../../components/Text'
import { mobileOrDesktop } from '../../components/ThemeProvider/theme';

import Chart from './Chart'
import allData from '../../allData.json';

const rangeFilter = (ranges, abs) => ({
  filterMethod: ({ id, value }, row) => {
    if (value === 'all') return true;
    if (value === 'null') {
      return row[id] === null;
    }
    let v = row[id];
    if (v === null) return false;
    if (abs) v = Math.abs(v);
    return value.split('~').every((r, i) => {
      const th = parseFloat(r);
      return i ? v < th : v >= th;
    });
  },
  Filter: ({ filter, onChange }) =>
    <select
      onChange={event => onChange(event.target.value)}
      style={{ width: '100%' }}
      value={filter ? filter.value : 'all'}
    >
      <option value="all">全部</option>
      {ranges.map(({ value, label }, i) => (<option key={i} value={value}>{label}</option>))}
    </select>
})

const genR2 = ({ Header, accessor }) => ({
  Header,
  accessor,
  maxWidth: 90,
  ...rangeFilter([
    { value: '0.8~1.1', 'label': '>=0.8' },
    { value: '0.5~0.8', 'label': '0.5-0.8' },
    { value: '0.2~0.5', 'label': '0.2-0.5' },
    { value: '0~0.2', 'label': '<0.2' },
    { value: 'null', 'label': '無值' },
  ]),
});

const genEquation = (accessor) => ({
  accessor,
  show: false,
});
class IndexPage extends PureComponent {
  state = {
    regressionType: 'linear',
  }

  handleRegression = regressionType => () => this.setState({ regressionType });

  render() {
    const { regressionType } = this.state;
    return (
      <Layout>
        <Box py={mobileOrDesktop(0, '2em')} px="2em">
        <ReactTable
          data={allData}
          filterable
          sortable={false}
          getTdProps={() => ({
            style: {
              whiteSpace: 'normal',
            }
          })}
          columns={[
            {
              Header: '主表id',
              accessor: 'id',
              maxWidth: 100,
            },
            {
              Header: '區間',
              id: 'interval',
              accessor: ({ id }) => id.substr(-1),
              maxWidth: 60,
            },
            {
              Header: '主表',
              accessor: 'name',
            },
            {
              Header: '副表id',
              accessor: 'index',
              maxWidth: 60,
            },
            {
              Header: '副表',
              accessor: 'tableName',
            },
            ...[
              {
                Header: 'R2(線性)',
                accessor: 'linearR2',
              },
              {
                Header: 'R2(exp)',
                accessor: 'exponentialR2',
              },
            ].map(genR2),
            {
              Header: '斜率',
              accessor: 'linearEquation[0]',
              maxWidth: 100,
              filterMethod: (filter, row) => {
                const val = get(row, filter.id);
                if (filter.value === 'all') {
                  return true;
                }
                if (filter.value === 'null') {
                  return val === null;
                }
                if (filter.value === '0') {
                  return val === 0;
                }
                return val * filter.value > 0;
              },
              Filter: ({ filter, onChange }) =>
                <select
                  onChange={event => onChange(event.target.value)}
                  style={{ width: '100%' }}
                  value={filter ? filter.value : 'all'}
                >
                  <option value="all">全部</option>
                  <option value="+1">正值(+)</option>
                  <option value="-1">負值(-)</option>
                  <option value="0">持平(0)</option>
                  {/* <option value="null">無值</option> */}
                </select>
            },
            {
              Header: '曲度',
              accessor: 'exponentialEquation[1]',
              maxWidth: 100,
              ...rangeFilter([
                { value: '0.2~1', 'label': '>0.2' },
                { value: '0.1~0.2', 'label': '0.1-0.2' },
                { value: '0~0.1', 'label': '0-0.1' },
                { value: 'null', 'label': '無值' },
              ]),
            },
            ...[
              'linearEquation',
              'exponentialEquation',
            ].map(genEquation),
            {
              Header: '滿20年',
              accessor: 'notEnough',
              maxWidth: 80,
              filterMethod: ({ id, value }, rows) => {
                if (value === 'all') return true;
                return rows[id] !== Boolean(+value);
              },
              Filter: ({ filter, onChange }) =>
                <select
                  onChange={event => onChange(event.target.value)}
                  style={{ width: '100%' }}
                  value={filter ? filter.value : 'all'}
                >
                  <option value="all">全部</option>
                  <option value="1">滿20年</option>
                  <option value="0">未滿20年</option>
                </select>
              ,
              Cell: ({ value }) => value ? '未滿' : '滿',
            },
            {
              Header: 'Chart',
              width: 350,
              accessor: 'startIndex',
              Cell: row => <Chart regressionType={regressionType} {...row} />,
              filterMethod: () => true,
              Filter: () =>
                <Box>
                  {[['linear', '線性'], ['exponential', 'Exp']].map(([type, label]) => (
                    <Box is="label" mx="0.5em" key={type}>
                      <input
                        type="radio"
                        name="regression-type"
                        value={type}
                        checked={regressionType === type}
                        onChange={this.handleRegression(type)}
                      />
                      <Text is="span" ml="0.25em">{label}</Text>
                    </Box>
                  ))}
                </Box>
              ,
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        </Box>
      </Layout>
    )
  }
}

export default IndexPage
