const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require('./utils/fauna');
const atob = require('atob');

exports.handler = async (event, context) => {
  const { user } = context.clientContext;
  
  console.log(user);
  
  const query = `
      query ($netlifyID: ID!) {
        getUserByNetlifyID(netlifyID: $netlifyID){
          stripeID
          netlifyID
        }
      }
    `;
  const variables = { netlifyID: user.sub };

  console.log({variables});
    
  //   const result = await faunaFetch({query, variables});

  const result = {
    'data': {
      'getUserByNetlifyID': {
        'stripeID': 'cus_HrxGz8ueOUVY3a',
        'netlifyID': '704168b7-166a-4c6e-b848-2de9fedfa295'
      }
    }
  };

  //   console.log({result});

  //   const stripeID = result.data.getUserByNetlifyID.stripeID;
  //   const link = await stripe.billingPortal.sessions.create({
  //     customer: stripeID,
  //     return_url: process.env.URL
  //   });

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
