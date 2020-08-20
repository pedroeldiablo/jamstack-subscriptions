const fetch = require('node-fetch');

exports.faunaFetch = async({ query, variables}) => {
  console.log({query});
  console.log({variables});
  console.log(process.env.FAUNA_SERVER_KEY);

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
    .then(res => console.log('faunaFetch res ', res))
    .then(res => res.json())
    .catch(err => console.error('Fauna error ', err, null, 2));
};
