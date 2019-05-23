import React, { PureComponent } from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import get from 'lodash/get';

import Layout from '../Layout';
import Box from '../../components/Box'
import Flex from '../../components/Flex'
import Text from '../../components/Text'
import { mobileOrDesktop } from '../../components/ThemeProvider/theme';

import Chart from './Chart'
import allData from '../../allData.json';
import regressions from './regressions';

const rangeFilter = (ranges, abs) => ({
  filterMethod: ({ id, value }, row) => {
    if (value === 'all') return true;
    if (value === 'null') {
      return row[id] === null;
    }
    let v = row[id];
    // if (v === null) return false;
    if (abs) v = Math.abs(v);
    const rule = /^(<|>)=?\d+(\.\d+)?$/;
    if (rule.test(value)) return eval(`${v}${value}`);

    const config = value.split('~');
    if (config.length === 1) return v >= config;
    return config.every((r, i) => {
      const th = parseFloat(r);
      return i ? v < th : v >= th;
    });
  },
  // Filter: ({ filter, onChange }) =>
  //   <select
  //     onChange={event => onChange(event.target.value)}
  //     style={{ width: '100%' }}
  //     value={filter ? filter.value : 'all'}
  //   >
  //     <option value="all">全部</option>
  //     {ranges.map(({ value, label }, i) => (<option key={i} value={value}>{label}</option>))}
  //   </select>
})

const posiNegFilter = ({ Header, accessor }) => ({
  Header,
  accessor,
  maxWidth: 80,
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
})

const genR2 = ({ Header, accessor }) => ({
  Header,
  accessor,
  maxWidth: 100,
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
        <Box py={mobileOrDesktop(0, '2em')} px="1em">
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
                maxWidth: 50,
              },
              {
                Header: '主表',
                accessor: 'name',
              },
              {
                Header: '副表id',
                accessor: 'index',
                maxWidth: 60,
                show: false,
              },
              {
                Header: '副表',
                accessor: 'tableName',
              },
              {
                Header: 'Chart',
                width: 350,
                accessor: 'startIndex',
                Cell: row => <Chart regressionType={regressionType} {...row} />,
                filterMethod: () => true,
                Filter: () => (
                  <Flex flexWrap="wrap">
                    {regressions.map((type) => (
                      <Box is="label" mx="0.5em" key={type}>
                        <input
                          type="radio"
                          name="regression-type"
                          value={type}
                          checked={regressionType === type}
                          onChange={this.handleRegression(type)}
                        />
                        <Text is="span" ml="0.25em">{type}</Text>
                      </Box>
                    ))}
                  </Flex>
                ),
              },
              ...regressions.map((type) => ({
                  Header: `R2(${type})`,
                  accessor: `${type}R2`,
              })).map(genR2),
              posiNegFilter({
                Header: '斜率',
                accessor: 'linearEquation[0]',
              }),
              posiNegFilter({
                Header: '曲度(exp)',
                accessor: 'exponentialEquation[1]',
              }),
              posiNegFilter({
                Header: '斜率(log)',
                accessor: 'logarithmicEquation[1]',
              }),
              // posiNegFilter({
              //   Header: '曲度(power)',
              //   accessor: 'powerEquation[1]',
              // }),
              ...regressions.map(type => `${type}Equation`).map(genEquation),
              {
                Header: '滿20年',
                accessor: 'notEnough',
                maxWidth: 80,
                filterMethod: ({ id, value }, rows) => {
                  if (value === 'all') return true;
                  return rows[id] !== Boolean(+value);
                },
                Filter: ({ filter, onChange }) => (
                  <select
                    onChange={event => onChange(event.target.value)}
                    style={{ width: '100%' }}
                    value={filter ? filter.value : 'all'}
                  >
                    <option value="all">全部</option>
                    <option value="1">滿20年</option>
                    <option value="0">未滿20年</option>
                  </select>
                ),
                Cell: ({ value }) => value ? '未滿' : '滿',
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
