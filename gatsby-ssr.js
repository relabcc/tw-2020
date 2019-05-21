/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
// import React from 'react';
import wrapWithProvider from './with-provider';
// import LanguageProvider from './src/i18n/LanguageProvider';

export const wrapRootElement = wrapWithProvider;
// export const wrapPageElement = ({ element, props }) => <LanguageProvider {...props}>{element}</LanguageProvider>
