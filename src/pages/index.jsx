import React,  {useContext, useState, useEffect} from 'react';
import { IdentityContext } from '../../identity-context';
// import { IdentityModal, useIdentityContext, useNetlifyIdentity } from 'react-netlify-identity-widget';
// import netlifyIdentity from 'netlify-identity-widget';
// import 'react-netlify-identity-widget/styles.css';
// import '@reach/tabs/styles.css';

export const Index = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  console.log({user});
  console.log({netlifyIdentity});
  const [isRole, setIsRole] = useState('no role defined');

  

  useEffect(() => {
    const loadSubscriptionContent = async (user) => {
      const token = user ? await netlifyIdentity.currentUser().jwt(true) : false;
  
      ['free', 'pro', 'premium'].forEach((type) => {
        fetch('/.netlify/functions/get-protected-content', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ type })
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('What is the data?', data);
  
            // img.src = data.image.url;
            // img.alt = data.image.description;
            // credit.href = data.creditLink;
            // credit.innerText = `Credit: ${data.credit}`;
            // caption.innerText = data.message;
          });
      });
    };

    function refreshToken () {
      if (user) {
        console.log('Current user', user);
        netlifyIdentity.currentUser().jwt(true).then((token) => {
          const parts = token.split('.');
          const currentUser = JSON.parse(atob(parts[1]));
          const { roles } = currentUser.app_metadata;
          console.log(roles);
          setIsRole(roles);
        });
      }
    }
    refreshToken();
    loadSubscriptionContent(user);
  },[user, netlifyIdentity]);

  function manageSubscription() {
    if (user) {
      const { token } = user;
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


  

  // const handleUserStateChange = (user) => {
  //   updateUserInfo(user);
  //   loadSubscriptionContent(user);
  // };

  return (
    <>
      {user ?  <>
        <p>Hi {user.user_metadata.full_name}</p>
        <p>Hi {isRole}</p>
        <h2>Manage your subscription</h2>
        <button id="manage-subscription" onClick={manageSubscription}>Manage Your Subscriptions</button>
        <button onClick={() => {
          netlifyIdentity.open();
        }}>Log Out</button>
      </>
        :
        <>
          <h1>Sign up for Premium content</h1>
          <p>Access exclusive posts and demos</p>
          <button onClick={() => {
            netlifyIdentity.open();
          }}>Log In or Sign Up</button>
        </>
      } 
    </>
  );
};

export default Index;
