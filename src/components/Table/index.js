import React, { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';
import tag from 'clean-tag';
import get from 'lodash/get';
import isObject from 'lodash/isObject';
import loSortBy from 'lodash/sortBy';

import { width, space, color, style, themeGet } from 'styled-system';

import Text from '../Text';
import Box from '../Box';
import SortableTh from './SortableTh';

import blacklist from '../utils/blacklist';

const height = style({
  prop: 'rowHeight',
  cssProperty: 'height',
  numberToPx: true,
});

const extendedBl = blacklist.concat('rowHeight');

const StyledTable = styled(tag)`
  ${width}
  ${space}
  ${color}
  thead th {
    border-bottom: 2px solid ${themeGet('colors.darkGray')};
    text-align: left;
  }
  tbody td {
    border-bottom: 1px solid ${themeGet('colors.gray')};
  }
  td, th {
    padding: 0.75em;
    ${height}
  }
`;

class Table extends PureComponent {
  state = {
    desc: this.props.isDesc,
    sortBy: this.props.sortBy,
  };

  handleSortClick = key => () => {
    const { sortBy, desc } = this.state;
    if (key === sortBy) {
      this.setState({ desc: !desc });
    } else {
      this.setState({ sortBy: key, desc: true });
    }
  };

  render() {
    const {
      columns,
      data,
      showIndex,
      toolbox,
      renderTh,
      isDesc,
      sortBy: sb,
      disabled,
      ...props
    } = this.props;
    const { sortBy, desc } = this.state;
    let sortedData = data;
    if (sortBy && !disabled) {
      sortedData = desc
        ? loSortBy(data, sortBy)
        : loSortBy(data, sortBy)
          .slice()
          .reverse();
    }
    return (
      <StyledTable width={1} blacklist={extendedBl} is="table" {...props}>
        <thead>
          <tr>
            {showIndex && <th />}
            {columns.map(col => {
              let { key, label } = col;
              if (isObject(col)) {
                if (!label) {
                  label = key;
                }
              } else {
                key = col;
                label = col;
              }
              if (renderTh) {
                return <th key={key}>{renderTh({ key, label })}</th>;
              }
              return (
                <SortableTh
                  key={key}
                  active={sortBy === key}
                  desc={desc}
                  onClick={disabled ? null : this.handleSortClick(key)}
                >
                  {label}
                </SortableTh>
              );
            })}
            {toolbox && <th />}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => {
            const isDisabled = get(disabled, index);
            return (
              <tr key={index}>
                {showIndex && (
                  <Box
                    is="td"
                    color={row.error && 'danger'}
                    opacity={isDisabled && 0.5}
                  >
                    #{index + 1}
                  </Box>
                )}
                {columns.map(col => {
                  let { key, renderer } = col;
                  if (!isObject(col)) {
                    key = col;
                    renderer = null;
                  }
                  return (
                    <Box
                      key={index + key}
                      is="td"
                      color={row.error && 'danger'}
                      opacity={isDisabled && 0.5}
                    >
                      {createElement(
                        renderer || Text,
                        { data: row },
                        get(row, key),
                      )}
                    </Box>
                  );
                })}
                {toolbox && (
                  <td>{createElement(toolbox, { data: row, index })}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    );
  }
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.node,
        renderer: PropTypes.func,
      }),
      PropTypes.string,
    ]),
  ),
  data: PropTypes.arrayOf(PropTypes.object),
  rowHeight: PropTypes.string,
  sortBy: PropTypes.string,
  showIndex: PropTypes.bool,
  toolbox: PropTypes.func,
  isDesc: PropTypes.bool,
};

Table.defaultProps = {
  rowHeight: '4em',
  isDesc: true,
};

export default Table;
