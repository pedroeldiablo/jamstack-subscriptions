const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require('./utils/fauna');

exports.handler = async (event, context) => {
  const { user } = context.clientContext;
  const {token} = context.clientContext.identity;
  const parts = token.split('.');
  const currentUser = JSON.parse(atob(parts[1]));

  console.log({event});
  console.log('what is the client context currentUser?', currentUser);

  console.log('what is the user in create manage link', user);

  const query = `
        query($netlifyID: ID!) {
            getUserByNetlifyID(netlifyID: $netlifyID){
            stripeID
            netlifyID
            }
        }
    `;

  const variables = { netlifyID: currentUser};

  const result = await faunaFetch({query, variables});

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
