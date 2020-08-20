import React, {useState, useEffect} from 'react';
import { IdentityModal, useIdentityContext } from 'react-netlify-identity-widget';
import 'react-netlify-identity-widget/styles.css';
import '@reach/tabs/styles.css';

export const Index = () => {
  const identity = useIdentityContext();
  const [dialog, setDialog] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState('not subscribed');

  const loggedInEffect = () => {
    if (identity && identity.user) {
      const { roles } =  identity.user.app_metadata;
      const { id } =  identity.user;
      const currentUser = identity.user;
      const { token } = identity.user;
      // const {sub} = currentUser;
      console.log({roles});
      console.log({id});
      console.log({token});
      const accessToken = token.access_token;
      console.log({accessToken});

      const parts = accessToken.split('.');
      const headerToken = JSON.parse(atob(parts[1]));
      const accessHeader = parts[0];
      console.log({accessHeader});
      console.log({parts});
      console.log({headerToken});

      console.log('What is the token?', identity.user.token.access_token);
      console.log('What is the currentUser?', currentUser);
      // console.log('What is the sub?', sub);
      setIsSubscribed(roles);
      fetch('/.netlify/functions/create-manage-link', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`
        }
      })
        // .then((res) => res.body.json())
        .then((res) => console.log(res.body))
        .catch((err) => console.error(err));
    } 
  };
         
  useEffect(() => {
    console.log('used loggedInEffect');
    loggedInEffect();
  });

  const name =
    (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.full_name) || 'NoName';
  return (
    <>
      <h1>Sign up for Premium content</h1>
      <p>Hi {name}</p>
      <p>What's your subscription? {isSubscribed}</p>
      <p>Access exclusive posts and demos</p>
      { identity && identity.isLoggedIn && (
        <>
          <h2>Manage your subscription</h2>
          <button id="manage-subscription">Manage Your Subscriptions</button>
          <pre>{JSON.stringify(identity, null, 2)}</pre>  
        </>
      )}
      {!dialog && (<button onClick={() => setDialog(true)}>Log On</button>)}
      <IdentityModal
        showDialog={dialog}
        onCloseDialog={() => setDialog(false)}
        onLogin={(user) => console.log('hello ', user?.user_metadata, user?.app_metadata)}
        onSignup={(user) => console.log('welcome ', user?.user_metadata)}
        onLogout={() => console.log('bye ', name)}
      />

    </>
  );
};

export default Index;
