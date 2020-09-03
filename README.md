# Only Funds

## Simple subscription based content site

## Gatsby, Netlify, Stripe, Contentful :rainbow:

Getting up and running.

Gatsby: static site generation.
Github: Repository
Netlify: Build and deployment
Netlify Identity: logins and sign-up.
Netlify (serverless) functions: lamda functions made easy.
Fauna: DB of users with IDs.
Stripe for payment and subscription product set-up.
Contentful for content management.
This will be were the restricted content is create and stored.

Content is king or so the adage goes.
Subscriptions offer a way to protect and in some cases monetize access.

Running Stripe

stripe listen --forward-to=https://{YOUR_NETLIFY_SITES_NAME}.netlify.app/.netlify/functions/handle-subscription-change
