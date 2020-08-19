import React, {useState} from 'react';
import { IdentityModal, useIdentityContext } from 'react-netlify-identity-widget';
import 'react-netlify-identity-widget/styles.css';
import '@reach/tabs/styles.css';

export const Index = () => {
  const identity = useIdentityContext();
  const [dialog, setDialog] = useState(false);
  const name =
    (identity && identity.user && identity.user.user_metadata && identity.user.user_metadata.full_name) || 'NoName';
  return (
    <>
      <h1>Sign up for Premium content</h1>
      <p>Hi {name}</p>
      <p>Access exclusive posts and demos</p>
      { identity && identity.isLoggedIn && (
        <pre>{JSON.stringify(identity, null, 2)}</pre>
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
