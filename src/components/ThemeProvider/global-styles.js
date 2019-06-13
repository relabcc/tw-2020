import { createGlobalStyle } from 'styled-components';

import theme from './theme';

export default createGlobalStyle`
  body {
    font-family: ${theme.font};
    min-width: 100%;
    min-height: 100%;
  }
  @media print {
    header {
      display: none!important;
    }
    .no-print {
      display: none!important;
    }
  }
`;
