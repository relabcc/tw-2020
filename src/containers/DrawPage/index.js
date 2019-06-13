import React, { PureComponent } from 'react';
import { tsvParse } from 'd3-dsv'
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import zip from 'lodash/zip';

import Layout from '../Layout';
import Box from '../../components/Box'
import Text from '../../components/Text'
import LineChart from '../../components/LineChart';

class DrawPage extends PureComponent {
  state = {
    data: '',
    transpose: false,
  }

  handleData = (e) => {
    this.setState({
      data: e.target.value,
      parsed: tsvParse(e.target.value),
    })
  }

  handleTranspose = (e) => {
    const transpose = e.target.checked;
    this.setState(({ data }) => {
      const dataArray = data.split('\n').map((row) => row.split('\t'));
      const newData = transpose ? zip(...dataArray).map((row) => row.join('\t')).join('\n') : data;
      return {
        transpose,
        parsed: tsvParse(newData),
      };
    })
  }

  render() {
    const { data, parsed, transpose } = this.state;
    return (
      <Layout>
        <Box px="2em">
          <Box
            is="textarea"
            onChange={this.handleData}
            width={1}
            height="6em"
            placeholder="貼上excel表資料"
            color="gray"
            value={data}
            className="no-print"
          />
          {data && (
            <Box my="1em">
              <Box my="0.5em">
                <Text mb="0.5em">共匯入{parsed.length}筆資料</Text>
                <Box is="label" className="no-print">
                  <input type="checkbox" onChange={this.handleTranspose} checked={transpose} />
                  對調XY軸
                </Box>
              </Box>
              <ReactTable
                data={parsed}
                showPagination={false}
                pageSize={parsed.length}
                columns={(() => {
                  const years = [];
                  const columns = parsed.columns.reduce((cols, col) => {
                    if (isNaN(col)) {
                      cols.push({
                        accessor: col,
                        Header: col,
                      })
                    } else {
                      years.push(+col);
                    }
                    return cols;
                  }, [])
                  if (years.length) {
                    return columns.concat({
                      Header: 'Chart',
                      accessor: () => years,
                      id: 'chart',
                      minWidth: 300,
                      Cell: ({ original, value }) => {
                        return (
                          <LineChart
                            width={300}
                            height={150}
                            showAxis
                            data={value.map((year) => ({
                              date: new Date(year, 11, 31),
                              value: parseFloat(original[year]) || 0,
                            }))}
                          />
                        );
                      }
                    })
                  }
                  return columns;
                })()}
                sortable={false}
                className="-striped -highlight"
              />
            </Box>
          )}
        </Box>
      </Layout>
    );
  }
}

export default DrawPage;
