import React, {useState, useEffect} from 'react';
import { IdentityModal, useIdentityContext } from 'react-netlify-identity-widget';
import 'react-netlify-identity-widget/styles.css';
import '@reach/tabs/styles.css';

export const Index = () => {
  const identity = useIdentityContext();
  // const refreshToken =  identity.getFreshJWT(true).then((JWT) => console.log('Refresh token', JWT));
  // console.log({identity});
  const [dialog, setDialog] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState('not subscribed');
  // const [isRole, setIsRole] = useState('no role defined');
      
  useEffect(() => {
    const loggedInEffect = () => {
      if (identity && identity.user) {
        // const token =  identity.getFreshJWT(true).then((JWT) => console.log('New JWT', JWT));
        // const token = identity.user.token.access_token;
        // const parts = token.split('.');
        // const currentUser = JSON.parse(atob(parts[1]));
        // const { roles } = currentUser.app_metadata;
  
        const { roles } =  identity.user.app_metadata;
        setIsSubscribed(roles);
      } 
    };
    console.log('used loggedInEffect');
    loggedInEffect();
  },[isSubscribed, identity]);

  function manageSubscription() {
    if (identity && identity.user) {
      const { token } = identity.user;
      fetch('/.netlify/functions/create-manage-link', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.access_token}`
        }
      })
        .then((response) => response.json())
        .then((link) => {
          window.location.href = link;
        })
        .catch((err) => console.error(err));
    } 
  }


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
          <button id="manage-subscription" onClick={manageSubscription}>Manage Your Subscriptions</button>
          {/* <pre>{JSON.stringify(identity, null, 2)}</pre>   */}
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
