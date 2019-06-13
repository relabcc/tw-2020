import React, { PureComponent } from 'react';
import { Line, LinePath, Bar } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import { curveMonotoneX } from '@vx/curve';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { Group } from '@vx/group';
import { extent, bisector } from 'd3-array';
import format from 'date-fns/format'

import theme from './ThemeProvider/theme';

// accessors
const xValue = d => new Date(d.date);
const yValue = d => d.value;
const bisectDate = bisector(d => new Date(d.date)).left;

// responsive utils for axis ticks
function numTicksForHeight(height) {
  if (height <= 300) return 3;
  if (300 < height && height <= 600) return 5;
  return 10;
}

function numTicksForWidth(width) {
  if (width <= 300) return 2;
  if (300 < width && width <= 400) return 5;
  return 10;
}

class LineChart extends PureComponent {
  handleTooltip = ({ event, data, xValue, xScale, yScale }) => {
    const { showTooltip } = this.props;
    const { x } = localPoint(event);
    const x0 = xScale.invert(x);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    if (d1 && d1.date) {
      d = x0 - xValue(d0.date) > xValue(d1.date) - x0 ? d1 : d0;
    }
    showTooltip({
      tooltipData: d,
      tooltipLeft: x,
      tooltipTop: yScale(d.value)
    });
  }

  render() {
    const {
      width,
      height,
      margin,
      data,
      hideTooltip,
      tooltipData,
      tooltipTop,
      tooltipLeft,
      dateFormater,
      startIndex,
      regressionFormula,
      showAxis,
    } = this.props;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const xScale = scaleTime({
      range: [margin.left, width - margin.right],
      domain: extent(data, xValue)
    });
    const yScale = scaleLinear({
      range: [height - margin.bottom, margin.top],
      domain: extent(data, yValue)
    });

    const subSet = data.slice(startIndex);
    return (
      <div>
        <svg width={width} height={height}>
          {showAxis && (
            <Group>
              <AxisLeft
                top={0}
                left={margin.left * 0.8}
                scale={yScale}
                hideZero
                numTicks={numTicksForHeight(height)}
              />
              <AxisBottom
                top={height - margin.bottom}
                left={margin.left / 2}
                scale={xScale}
                numTicks={6}
                label="Time"
              />
            </Group>
          )}
          <LinePath
            data={data}
            x={dd => xScale(xValue(dd))}
            y={dd => yScale(yValue(dd))}
            stroke="black"
            strokeWidth={2}
            opacity={0.2}
          />
          <LinePath
            data={subSet}
            x={dd => xScale(xValue(dd))}
            y={dd => yScale(yValue(dd))}
            stroke="black"
            strokeWidth={2}
          />
          {regressionFormula && (
            <LinePath
              data={subSet.map(regressionFormula)}
              x={dd => xScale(xValue(dd))}
              y={dd => yScale(yValue(dd))}
              stroke={theme.colors.primary}
              strokeWidth={2}
              style={{ pointerEvents: 'none' }}
              opacity={0.5}
              curve={curveMonotoneX}
            />
          )}
          <Bar
            x={margin.left}
            y={margin.top}
            width={xMax}
            height={yMax}
            fill="transparent"
            data={data}
            onTouchStart={event =>
              this.handleTooltip({
                event,
                xValue,
                xScale,
                yScale,
                data
              })
            }
            onTouchMove={event =>
              this.handleTooltip({
                event,
                xValue,
                xScale,
                yScale,
                data
              })
            }
            onMouseMove={event =>
              this.handleTooltip({
                event,
                xValue,
                xScale,
                yScale,
                data
              })
            }
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: yMax }}
                stroke={theme.colors.primary}
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
                strokeDasharray="2,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={theme.colors.primary}
                stroke="white"
                strokeWidth={2}
                style={{ pointerEvents: 'none' }}
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <Tooltip
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={{
                backgroundColor: theme.colors.primary,
                color: 'white'
              }}
            >
              {yValue(tooltipData)}
            </Tooltip>
            <Tooltip
              top={yMax + 5}
              left={tooltipLeft}
              style={{
                transform: 'translateX(-50%)'
              }}
            >
              {dateFormater(xValue(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
}

LineChart.defaultProps = {
  startIndex: 0,
  dateFormater: (d) => format(d, 'YYYY'),
  margin: {
    top: 10,
    bottom: 40,
    left: 50,
    right: 20,
  },
}

export default withTooltip(LineChart)
