import React from 'react';
import styled from 'styled-components';
import tag from 'clean-tag';
import {
  space,
  width,
  display,
  textAlign,
  height,
  top,
  left,
  right,
  bottom,
  position,
  color,
  fontSize,
  fontWeight,
  borderRadius,
  zIndex,
  borders,
  borderColor,
  flex,
  maxWidth,
  minWidth,
  maxHeight,
  minHeight,
  lineHeight,
  opacity,
  style,
} from 'styled-system';

import blacklist from './utils/blacklist';
import injectProps from './utils/injectProps';

const Box = styled(tag)`
  ${space}
  ${width}
  ${display}
  ${height}
  ${color}
  ${fontSize}
  ${position}
  ${zIndex}
  ${textAlign}
  ${top}
  ${left}
  ${right}
  ${bottom}
  ${fontWeight}
  ${borders}
  ${borderColor}
  ${flex}
  ${minWidth}
  ${maxWidth}
  ${minHeight}
  ${maxHeight}
  ${borderRadius}
  ${lineHeight}
  ${opacity}
  ${injectProps('whiteSpace')}
  ${injectProps('overflow')}
  ${injectProps('verticalAlign')}
  ${injectProps('transform')}
  ${injectProps('transition')}
  ${style({
    prop: 'zOrder',
    cssProperty: 'zIndex',
    key: 'zOrder',
  })}
  ${({ onClick }) => onClick && 'cursor: pointer;'}
`;

Box.defaultProps = {
  blacklist,
};

Box.displayName = 'Box';

Box.inline = (props) => <Box is="span" display="inline-block" verticalAlign="middle" {...props} />;

export default Box;
