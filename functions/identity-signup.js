const fetch =require('node-fetch');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);
  console.log(JSON.stringify(user, null, 2));

  const netlifyID = user.id;

  //TODO create a stripe custom object
  const customer = await stripe.customers.create({email: user.email});
  await stripe.subscriptions.create({customer: customer.id, 
    items: [{plan: 'price_1HHd5OHlq411g1DF99OhVJnS'}]});
  const stripeID = customer.id;
  
  //TODO create a custom record in Fauna
  const response = await fetch('https://graphql.fauna.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`
    },
    body: JSON.stringify({
      query: `
        mutation($netlifyID: ID! $stripeID: ID!) {
          createUser(data: {netlifyID: $netlifyID, stripeID: $stripeID}) {
            netlifyID
            stripeID
          }
        }
      `,
      variables: {
        netlifyID,
        stripeID
      }
    })
  })
    .then(res => res.json())
    .catch(err => console.error(err));

  console.log({response});
  
  return {
    statusCode: 200, 
    body: JSON.stringify({app_metadata: {roles: ['sub:free']}})
  };
};
