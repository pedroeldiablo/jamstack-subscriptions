const { contentfulFetch } = require('./utils/contentful');
  
exports.handler = async (event, context) => {
  console.log({event});
  const { type } = JSON.parse(event.body);
  const { user } = context.clientContext;
  //   const roles = user ? user.app_metadata.roles : false;
  const roles = ['premium'];
  console.log({roles});
  
  // Load content from Contentful
  const response = await contentfulFetch({
    query: `
        query {
          productCollection {
            items {
              title
              image {
                url(transform: {
                  width: 600,
                  height: 600,
                  quality: 80,
                  resizeStrategy: FILL
                })
                description
              }
              credit
              creditLink
              allowedRoles
            }
          }
        }
      `,
    variables: {}
  });

  console.log('Get content', response);
  
  const content = response.data.productCollection.items;
  console.log('Get content content', content);
  const requestedContent = content.find((c) => c.title === type);
  const { allowedRoles } = requestedContent;
  
  if (!roles || !roles.some((role) => allowedRoles.includes(role))) {
    return {
      statusCode: 402,
      body: JSON.stringify({
        image: {
          url: 'https://unsplash.com/photos/dGk-qYBk4OA',
          description:
              'No entry sign - Sorry you can\'t get in without a subscription to this content'
        },
        credit: 'Kyle Glenn',
        creditLink: 'https://unsplash.com/@kylejglenn',
        message: `This content requires a ${type} subscription.`
      })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(requestedContent)
  };
};
