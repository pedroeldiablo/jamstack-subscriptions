import {IdentityContextProvider} from 'react-netlify-identity-widget';
import React from 'react';

export const wrapRootElement = ({element}) => {
  // const url = process.env.REACT_APP_NETLIFY_IDENTITY_URL || 'url here for running locally'; // should look something like "https://foo.netlify.com"
  // if (!url)
  //   throw new Error(
  //     'process.env.REACT_APP_NETLIFY_IDENTITY_URL is blank2, which means you probably forgot to set it in your Netlify environment variables'
  //   );
  return (
    <IdentityContextProvider >{element}</IdentityContextProvider>

  );
};
