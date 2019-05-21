import styled from 'styled-components';
import { themeGet } from 'styled-system';

import Box from '../Box';

export default styled(Box).attrs({
  is: 'th',
})`
  ${props =>
    props.active &&
    `
    color: ${themeGet('colors.blue')(props)};
    &::after {
      content: '${props.desc ? '▼' : '▲'}';
      vertical-align: text-bottom;
    }
  `};
`;
