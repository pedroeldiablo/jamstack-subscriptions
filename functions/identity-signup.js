exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);
  console.log(JSON.stringify(user, null, 2));
  
  return {
    statusCode: 200, 
    app_metadata: {roles: ['sub:free']}
  };
};
