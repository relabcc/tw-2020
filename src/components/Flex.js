import {
  alignItems,
  justifyContent,
  flexDirection,
  flexWrap,
} from 'styled-system';
import styled from 'styled-components';

import Box from './Box';
import blacklist from './utils/blacklist'

const Flex = styled(Box)`
  ${alignItems}
  ${justifyContent}
  ${flexDirection}
  ${flexWrap}
`;

Flex.defaultProps = {
  display: 'flex',
  blacklist,
};

Flex.displayName = 'Flex';

export default Flex;
