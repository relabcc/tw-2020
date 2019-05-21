import React, { PureComponent } from 'react'
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import Layout from '../Layout';
import Box from '../../components/Box'
import { mobileOrDesktop } from '../../components/ThemeProvider/theme';

import Chart from './Chart'
import allData from '../../allData.json';

class IndexPage extends PureComponent {
  render() {
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
            },
            {
              Header: '主表',
              accessor: 'name',
            },
            {
              Header: '副表id',
              accessor: 'index',
            },
            {
              Header: '副表',
              accessor: 'tableName',
            },
            {
              Header: '斜率',
              accessor: 'gradient',
              filterMethod: (filter, row) => {
                if (filter.value === 'all') {
                  return true;
                }
                if (filter.value === 'null') {
                  return row[filter.id] === null;
                }
                if (filter.value === '0') {
                  return row[filter.id] === 0;
                }
                return row[filter.id] * filter.value > 0;
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
              Header: 'R^2',
              accessor: 'r2',
              filterMethod: ({ id, value }, row) => {
                if (value === 'all') return true;
                if (value === 'null') {
                  return row[id] === null;
                }
                return value.split('~').every((r, i) => {
                  const v = row[id];
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
                  <option value="0.8~1.1">&gt;0.8</option>
                  <option value="0.5~0.8">0.5-0.8</option>
                  <option value="0.2~0.5">0.2-0.5</option>
                  <option value="0~0.2">&lt;0.2</option>
                  {/* <option value="null">無值</option> */}
                </select>
            },
            {
              Header: '滿20年',
              accessor: 'notEnough',
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
              Cell: Chart,
              filterable: false,
            },
            {
              Header: '截距',
              accessor: 'yIntercept',
              show: false,
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
