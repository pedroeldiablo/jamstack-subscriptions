const fetch = require('node-fetch');

exports.faunaFetch = async({ query, variables}) => {
  console.log({query});
  console.log({variables});

  await fetch('https://graphql.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
    .then(res => res.json())
    .catch(err => console.error(err, null, 2));
};
