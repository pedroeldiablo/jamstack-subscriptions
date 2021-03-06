const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');
const { faunaFetch } = require('./utils/fauna');

exports.handler = async ({ body, headers }, context) => {
  // console.log('boop');
  const whatsUp = context;
  // console.log({body});
  // console.log({headers});

  // console.log({whatsUp});

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object;

      // console.log('What is subscription?', subscription);

      const stripeID = subscription.customer;
      const plan = subscription.plan.nickname;

      // console.log('what is the plan? ', subscription.plan.nickname);

      const role = `${plan.split(' ')[0].toLowerCase()}`;

      const query = `
          query ($stripeID: ID!) {
            getUserByStripeID(stripeID: $stripeID){
              netlifyID
            }
          }
        `;
      const variables = { stripeID };

      const result = await faunaFetch({ query, variables });
      const netlifyID = result.data.getUserByStripeID.netlifyID;

      // const userContext = context;

      // console.log({userContext});



      const { identity } = context.clientContext;
      // console.log('identity', identity);
      const response = await fetch(`${identity.url}/admin/users/${netlifyID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${identity.token}`
        },
        body: JSON.stringify({
          app_metadata: {
            roles: [role]
          }
        })
      })
        .then((res) => res.json())
        .catch((err) => console.error(err));

      // console.log(response);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (err) {
    console.log(`Stripe webhook failed with ${err}`);

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`
    };
  }
};
