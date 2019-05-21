import React, { PureComponent } from 'react';
import { Line, LinePath, Bar } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';
import { extent, bisector } from 'd3-array';

import theme from './ThemeProvider/theme';

// accessors
const xValue = d => new Date(d.date);
const yValue = d => d.value;
const bisectDate = bisector(d => new Date(d.date)).left;

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
      data,
      hideTooltip,
      tooltipData,
      tooltipTop,
      tooltipLeft,
      dateFormater,
      startIndex,
      yIntercept,
      gradient,
    } = this.props;

    // bounds
    const xMax = width * 0.9;
    const yMax = height * 0.9;

    // scales
    const xScale = scaleTime({
      range: [0, xMax],
      domain: extent(data, xValue)
    });
    const yScale = scaleLinear({
      range: [yMax, height * 0.1],
      domain: extent(data, yValue)
    });

    const subSet = data.slice(startIndex);

    return (
      <div>
        <svg width={width} height={height}>
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
          <Line
            from={{ x: xScale(xValue(subSet[0])), y: yScale(yIntercept) }}
            to={{ x: xMax, y: yScale(yIntercept + (gradient * subSet.length)) }}
            stroke={theme.colors.primary}
            strokeWidth={2}
            style={{ pointerEvents: 'none' }}
            opacity={0.5}
          />
          <Bar
            x={0}
            y={0}
            width={xMax}
            height={height}
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
                from={{ x: tooltipLeft, y: 0 }}
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

export default withTooltip(LineChart)
