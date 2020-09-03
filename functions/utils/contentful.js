const fetch = require('node-fetch');

exports.contentfulFetch = async ({ query, variables }) => {
  return await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_CDA_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    }
  )
    .then((res) => res.json())
    .catch((err) => console.error(JSON.stringify(err, null, 2)));
};
