# Parité au Pouvoir

This is here that you will find the code for the Parité au Pouvoir new single page app.

## Structure

Backend is made for now with a node express server.

Frontend is a React-Redux app bundled by webpack.

## Install
Yarn is a promising node package manager. We recommend to use it.
So first make sure you have a global version of it (https://yarnpkg.com/en/docs/install).
```
npm install -g yarn
```
then in your itcounts folder, type
```bash
npm set registry https://registry.npmjs.org
yarn
```

## Run locally
It you want to run with having a Hot Module Reload system:
```bash
  npm run dev
```

Or if you want just to test localhost the prod conditions with the production bundle (make sure you did npm run build-prod before)
```bash
  npm run prod
```

## Deploy
For now, deploying in staging (production should be done via a Continuous integration system)
```bash
npm run deploy-stg
```

## Note
In order to create  custom domain with one&on and heroku,
you need to define a subdomain www. , and in that subdomain,
you can set the CNAME in order to target the DNS Target found
in the heroku settings.
