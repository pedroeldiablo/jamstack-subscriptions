const { contentfulFetch } = require('./utils/contentful');
  
exports.handler = async (event, context) => {
  console.log('What is the event body', event.body);

  const { type } = JSON.parse(event.body);
  const { user } = context.clientContext;
  const roles = user ? user.app_metadata.roles : false;
  // const roles = ['free'];
  // console.log({roles});
  
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
  console.log('what type', type);
  console.log('Get content content', content);
  const requestedContent = content.find((c) => c.title === type);
  console.log('what is the requestedContent', requestedContent);
  const { allowedRoles } = requestedContent;
  
  if (!roles || !roles.some((role) => allowedRoles.includes(role))) {
    return {
      statusCode: 402,
      body: JSON.stringify({
        image: {
          url: 'https://images.unsplash.com/photo-1523672557977-2c106afb2278?w=600&h=600&q=80&fit=fill',
          description:
              'No entry sign - Sorry you can\'t get in without a subscription to this content'
        },
        credit: 'Kyle Glenn',
        creditLink: 'https://unsplash.com/@kylejglenn',
        title: `This content requires a ${type} subscription.`
      })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify(requestedContent)
  };
};
