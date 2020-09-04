import React,  {useContext, useState, useEffect} from 'react';
import { IdentityContext } from '../../identity-context';

export const Index = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  console.log({user});
  console.log({netlifyIdentity});
  const [isRole, setIsRole] = useState('You need to sign-in');
  const [subscriptionContent, setSubscriptionContent] = useState([]);

  

  useEffect(() => {
    const loadedChannels = [];
    const loadSubscriptionContent = async (user) => {
      const token = user ? await netlifyIdentity.currentUser().jwt(true) : false;
  
      ['free', 'pro', 'premium', 'super'].forEach((type) => {
        fetch('/.netlify/functions/get-protected-content', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ type })
        })
          .then((res) => res.json())
          .then((data) => {
            loadedChannels.push(data);
            
            console.log('What is the data?', data);
            console.log({subscriptionContent});
            setSubscriptionContent([...loadedChannels]);
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
        <div className="subscription-content">
          <div className="content">
            {
              
            }
            <p>{subscriptionContent.allowedRoles}</p>
            {/* title, image, credit, creditLink, allowedRoles */}
            {subscriptionContent.map(subscription =>
              <><div>{subscription.title}</div>
                <img src={subscription.image.url} alt={subscription.credit}></img></>
            )}
          </div>
        </div>
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
