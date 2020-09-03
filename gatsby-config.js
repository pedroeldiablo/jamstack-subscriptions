module.exports = {plugins: [
  'gatsby-plugin-theme-ui',
  // You can should only have one instance of this plugin
  {
    resolve: 'gatsby-plugin-netlify-identity',
    options: {
      url: 'https://jam-subscriptions.netlify.app/' // required!
    }
  }
]};
