const hostname = 'relabcc.github.io';
const pathPrefix = 'tw-2020';

module.exports = {
  siteMetadata: {
    title: 'TW 2020',
    description: '20年台灣數據',
    url: `https://${hostname}/${pathPrefix}`,
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'TW 2020',
        start_url: '/',
        'theme_color': '#ffffff',
        'background_color': '#ffffff',
        display: 'minimal-ui',
        icon: 'static/android-chrome-512x512.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-offline',
    // 'gatsby-transformer-json',
    // {
    //   resolve: 'gatsby-source-filesystem',
    //   options: {
    //     name: 'data',
    //     path: `${__dirname}/src/data`,
    //   },
    // },
  ],
  pathPrefix,
}
