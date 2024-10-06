# Introduction
This is a simple sample React UI which uses AWS Cognito to authenticat a user.

# Setup
Before running the app, make sure to do the following:
1. Create a **.env** file which contains the 2 environment variables:
```
VITE_APP_USER_POOL_ID=<Replace with Cognito User Pool Id found in Cognito->User Pools->YOUR POOL->User pool ID>
VITE_APP_CLIENT_ID=<Replace with Cognito Application Id found in Cognito->User Pools->YOUR POOL->App Integration Tab->YOUR APP CLIENT->Client ID>
```

2. (Optional) Create a **.env.production** if you need a separate env for when the UI is deployed

# Installing and Running
1. Install npm modules
```
npm install
```
2. Running locally
```
npm run dev
```
