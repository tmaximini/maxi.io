---
order: 1
path: '/blog/jwt-authorization-for-serverless-apis-on-aws-lambda'
title: 'JWT Authorization for serverless APIs on AWS Lambda'
subtitle: 'How to protect serverless API routes'
published: true
date: '20200311'
type: 'post'
keywords: 'jwt, serverless, aws, auth'
tags:
  - serverless
  - Lambda
year: 2020
---

![gate](gate.png '@jeremy unsplash.com')
<span style="font-size: 11px;">Photo by Jeremy Goldberg on Unsplash</span>

Serverless functions allow us to write small contained API endpoints for our apps. In this post we are going to learn how to secure our serverless API endpoint with a json web token ([JWT](https://jwt.io/)) based authorization.

### TL;DR

If you want to jump straight to the final code, you can find the repo here: [https://github.com/tmaximini/serverless-jwt-authorizer](https://github.com/tmaximini/serverless-jwt-authorizer)

Read on for a full explanation of what is going on here.

### Steps for JWT authorization

These are roughly the steps that we have to go through in order to secure our API endpoint:

1. Register with username, password, password hash gets stored in DB
2. Login with Username / Password
3. If hash of password matches stored passwordHash for user, generate a JWT token from user's id and their auth scope
4. Save token in Cookie 🍪
5. Sign every request with this token in the HTTP Authorization header
6. Setup authorizer function that verifies this token (on requesting a secured api route). authorizer response can be cached for a certain amount to increase api throughput.
7. Authorizer generates a [policyDocument](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html) that allows or denies access to the service

## Plan our app

We are going to need a `registerUser` and a `loginUser` method. We will also have an protected `/me` endpoint, that returns the the current user object if the user is authenticated correctly.

The `verifyToken` is an additional lambda function, that is defined as an API gatewa authorizer and will get called in the background whenever we try to access the protected `/me` endpoint.

So we have a total of 4 lambda functions:

![excalidraw diagram](https://dev-to-uploads.s3.amazonaws.com/i/djn6dil880qkhphmwlid.png)

## Setup our app with serverless framework

So let's initalize the app. You will find the final code of the example in github. We can run `serverless init --template aws-nodejs` to bootstrap a node.js based project. Make sure you've setup the AWS cli before or at least you have a `~/.aws/credentials` folder set up because this is where serverless will pull your information from.

Now we go and update the generated `serverless.yml` file. We are going to add all our functions from step 1 (register, login, me, verifyToken to it). It should look similar to this one:

```yaml
org: your-org

service: serverless-jwt-authorizer
provider:
  name: aws
  runtime: nodejs12.x
  region: eu-central-1
functions:
  verify-token:
    handler: functions/authorize.handler

  me:
    handler: functions/me.handler
    events:
      - http:
          path: me
          method: get
          cors: true
          authorizer:
            name: verify-token
            # this tells the lambda where to take the information from,
            # in our case the HTTP Authorization header
            identitySource: method.request.header.Authorization
            resultTtlInSeconds: 3600 # cache the result for 1 hour
  login:
    handler: functions/login.handler
    events:
      - http:
          path: login
          method: post
          cors: true
  register:
    handler: functions/register.handler
    events:
      - http:
          path: register
          method: post
          cors: true
```

### Folder structure for serverless APIs

The way I do it is to have a single file in `./functions` for each Lambda. Of course you can export multiple functions from the same file but like this I keep sanity and it makes naming easier (each file exports a _handler_ function that I use as the handler in serverless.yml).

All the helpers and non-lambda functions go into the `./lib` folder.

```bash
    .
    ├── Readme.md
    ├── functions
    │   ├── authorize.js
    │   ├── login.js
    │   ├── me.js
    │   └── register.js
    ├── handler.js
    ├── lib
    │   ├── db.js
    │   └── utils.js
    ├── package.json
    ├── secrets.json
    ├── serverless.yml
    └── yarn.lock
```

## The database layer

Now, before we can authorize a user, we are going to need a way to create a user and save them in the DB. We are going to pick DynamoDB as a database here because being a serverless database itself it is an excellent choice for serverless. Of course you could use any other database as well.

### DynamoDB

> Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale

DynamoDB works with a single table design. In our case, we just need a users table. I picked DynamoDB here because it is a famous and reliable choice for serverless APIs, especially because of the "pay as you go, scale as you grow" idea behind it.

If you want to know the ins and outs of DynamoDB I recommend you head over to [https://www.dynamodbguide.com/](https://www.dynamodbguide.com/) by [@alexbdebrie](https://twitter.com/alexbdebrie).

### The DB Model

When designing a service or an api I like to start with the data model. This is especially important with DynamoDB where we are limited by the single table design. This is why [DynamoDB experts](https://www.youtube.com/watch?v=HaEPXoXVf2k) [tell you](https://www.youtube.com/watch?v=DIQVJqiSUkE) to first write down all the access patterns and ways how you plan to query your data. Based on that you are going to model your table.

In our case, the schema is fairly simple for now, but we keep it generic enough to be able to extend it later on. I am using the [dynamodb-toolbox](https://github.com/jeremydaly/dynamodb-toolbox) package here to define my data model and simplify writing queries.

```js
const { Model } = require('dynamodb-toolbox');
const User = new Model('User', {
  // Specify table name
  table: 'test-users-table',

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Define schema
  schema: {
    pk: { type: 'string', alias: 'email' },
    sk: { type: 'string', hidden: true, alias: 'type' },
    id: { type: 'string' },
    passwordHash: { type: 'string' },
    createdAt: { type: 'string' },
  },
});
```

We will obviously not store the password in clear text in our database, so we use bcrypt (footnote about bcryptjs is the better choice on lambda) to create a `passwordHash` and then delete the original plain text password from the props object before spreading it into our user.

I chose the email here as a primary key and not the id because this is what I am using to query single items. You yould also use the userId or any combination.

It's important to not that DynamoDB can not fetch single items by non key properties, e.g. in the example above I am not able to say `getById(id)`. I would have to fetch them first and then filter by using a FilterExpression.

The advantage of a NoSQL database such as DynamoDB is that columns and fields are dynamic. So if we decide to send more data to the `createDbUser` method they'll all get added to the database (We have to adjust the DB `Model` from `dynamodb-toolkit` first though).

## Defining resources in serverless.yml

When we decided on our data model and table name it makes sense to revisit our `serverless.yml` and prepare the DynamoDB resource there, so we won't have to do any manual work from the AWS console. The serverless framework allows us to define resources and permissions right from the `serverless.yml` file.

We will also need a few _secret_ environment variables. A simple way to define them is just creating a _secrets.json_ file in your project root (make sure to .gitignore it!) and define them in a json format.

```yaml
org: your-org

custom:
  secrets: ${file(secrets.json)}
  tableName: 'test-users-table'

service: serverless-jwt-authorizer
provider:
  name: aws
  runtime: nodejs12.x
  region: eu-central-1
  environment:
    JWT_SECRET: ${self:custom.secrets.JWT_SECRET}
    AWS_ID: ${self:custom.secrets.AWS_ID}
  iamRoleStatements:
    - Effect: 'Allow'
      Action:
        - 'dynamodb:GetItem'
        - 'dynamodb:PutItem'
      Resource: 'arn:aws:dynamodb:eu-central-1:${self:custom.secrets.AWS_ID}:table/${self:custom.tableName}'
functions:
  verify-token:
    handler: functions/authorize.handler

  me:
    handler: functions/me.handler
    events:
      - http:
          path: me
          method: get
          cors: true
          authorizer:
            name: verify-token
            identitySource: method.request.header.Authorization
            resultTtlInSeconds: 3600
  login:
    handler: functions/login.handler
    events:
      - http:
          path: login
          method: post
          cors: true
  register:
    handler: functions/register.handler
    events:
      - http:
          path: register
          method: post
          cors: true
resources:
  Resources:
    usersTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tableName}
        AttributeDefinitions:
          - AttributeName: pk
            AttributeType: S
          - AttributeName: sk
            AttributeType: S
        KeySchema:
          - AttributeName: pk
            KeyType: HASH
          - AttributeName: sk
            KeyType: RANGE
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

## User registration

In order to let a user register for our service, we need to store their data in our database. With our data model in place, we can now use [AWS DynamoDB DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) together with our dynamodb-toolkit to simplify this process. Take a look at the following code:

```js
// lib/db.js

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { Model } = require('dynamodb-toolbox');
const { v4: uuidv4 } = require('uuid');

const User = new Model('User', {
  // Specify table name
  table: 'test-users-table',

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Define schema
  schema: {
    pk: { type: 'string', alias: 'email' },
    sk: { type: 'string', hidden: true, alias: 'type' },
    id: { type: 'string' },
    passwordHash: { type: 'string' },
    createdAt: { type: 'string' },
  },
});

// INIT AWS
AWS.config.update({
  region: 'eu-central-1',
});
// init DynamoDB document client
const docClient = new AWS.DynamoDB.DocumentClient();

const createDbUser = async props => {
  const passwordHash = await bcrypt.hash(props.password, 8); // hash the pass
  delete props.password; // don't save it in clear text

  const params = User.put({
    ...props,
    id: uuidv4(),
    type: 'User',
    passwordHash,
    createdAt: new Date(),
  });

  const response = await docClient.put(params).promise();

  return User.parse(response);
};

// export it so we can use it in our lambda
module.exports = {
  createDbUser,
};
```

This is enough for creating our user registration on the database side.

Now let's add the implementation for the actual lambda endpoint.

When getting triggered by an HTTP post, we want to extract the user data from the request body and pass it to the `createDbUser` method from our lib/db.js.

Let's create a file called `functions/register.js` that looks like this:

```js
// functions/register.js

const { createDbUser } = require('../lib/db');

module.exports.handler = async function registerUser(event) {
  const body = JSON.parse(event.body);

  return createDbUser(body)
    .then(user => ({
      statusCode: 200,
      body: JSON.stringify(user),
    }))
    .catch(err => {
      console.log({ err });

      return {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: { stack: err.stack, message: err.message },
      };
    });
};
```

We are trying to create the user, and if everything goes well we send the user object back with a 200 success status code, otherwise we send an error response.

Next, we are looking to implement the login.

### Logging in users

First, we need to extend our lib/db.js helpers file with a function that retrieves an user by email, so we can check if the user exists and if so compare the passwordHash to the hash of the password that was sent with the request.

```js
//...

const getUserByEmail = async email => {
  const params = User.get({ email, sk: 'User' });
  const response = await docClient.get(params).promise();

  return User.parse(response);
};

// don't forget to export it
module.exports = {
  createDbUser,
  getUserByEmail,
};
```

Now we can import and use this function in our user lambda.

Let's break down the steps we need for logging in the user:

1. get email & password from request payload
2. try to get user record from database for email
3. if found, hash password and compare with passwordHash from user record
4. if password is correct, create a valid jwt session token and send it back to the client

Here is the implementation of the `login` handler:

```js
// ./functions/login.js
const { login } = require('../lib/utils');

module.exports.handler = async function signInUser(event) {
  const body = JSON.parse(event.body);

  return login(body)
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session),
    }))
    .catch(err => {
      console.log({ err });

      return {
        statusCode: err.statusCode || 500,
        headers: { 'Content-Type': 'text/plain' },
        body: { stack: err.stack, message: err.message },
      };
    });
};

// ./lib/utils.js
async function login(args) {
  try {
    const user = await getUserByEmail(args.email);

    const isValidPassword = await comparePassword(
      args.password,
      user.passwordHash,
    );

    if (isValidPassword) {
      const token = await signToken(user);
      return Promise.resolve({
        auth: true,
        token: token,
        status: 'SUCCESS',
      });
    }
  } catch (err) {
    console.info('Error login', err);
    return Promise.reject(new Error(err));
  }
}

function comparePassword(eventPassword, userPassword) {
  return bcrypt.compare(eventPassword, userPassword);
}
```

With registration and login in place, we can now proceed to implement a protected API endpoint.

## Protected endpoints

So let's say we have a protected resource in our API. A user profile might be a good example. We only want logged in users to be able to see and update their profile information. Let's implement a `/me` endpoint that just returns the user record of the currently logged in user from the database.

Here are the steps we need to implement:

1. validate jwt token (_done by our lamda authorizer function_)
2. get related user from database
3. return user

Sounds simple right? Let's take a look:

```js
// ./functions/me.js
const { getUserByEmail } = require('../lib/db');
const { getUserFromToken } = require('../lib/utils');

module.exports.handler = async function(event) {
  const userObj = await getUserFromToken(event.headers.Authorization);

  const dbUser = await getUserByEmail(userObj.email);

  return {
    statusCode: 200,
    headers: {},
    body: JSON.stringify(dbUser),
  };
};

// ./lib/utils.js
async function getUserFromToken(token) {
  const secret = Buffer.from(process.env.JWT_SECRET, 'base64');

  const decoded = jwt.verify(token.replace('Bearer ', ''), secret);

  return decoded;
}
```

The implementation of `/me` is fairly short and straightforward. The way AWS authorizers work is by using _[policy documents](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html)_.

The policyDocument has to contain the following information:

- Resource (The _ARN_ orAmazon resource name, a unique identifier of a AWS resource)
- Effect (either `"allow"` or `"deny"`)
- Action (a keyword that describes the desired action, in our case `"execute-api:Invoke"`

### The authorizer function

```js
const jwt = require('jsonwebtoken');

function generateAuthResponse(principalId, effect, methodArn) {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument,
  };
}

function generatePolicyDocument(effect, methodArn) {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn,
      },
    ],
  };

  return policyDocument;
}

module.exports.verifyToken = (event, context, callback) => {
  const token = event.authorizationToken.replace('Bearer ', '');
  const methodArn = event.methodArn;

  if (!token || !methodArn) return callback(null, 'Unauthorized');

  const secret = Buffer.from(process.env.JWT_SECRET, 'base64');

  // verifies token
  const decoded = jwt.verify(token, secret);

  if (decoded && decoded.id) {
    return callback(
      null,
      generateAuthResponse(decoded.id, 'Allow', methodArn),
    );
  } else {
    return callback(
      null,
      generateAuthResponse(decoded.id, 'Deny', methodArn),
    );
  }
};
```

## Deploy and test

Now, let's run `sls deploy` and deploy our final service to AWS. The output should look like the following:

![sls deploy](https://dev-to-uploads.s3.amazonaws.com/i/13bfg5jot29q5pjyitgv.png)

You'll have 3 endpoints, just as we defined them, one for /register, one for /login and one for /me.

First, let's register a user using cURL:

```bash
    curl -H "Content-Type: application/json" -X POST -d "{\"email\": \"test@example.com\", \"password\": \"test123\"}" https://abc1234567.execute-api.eu-central-1.amazonaws.com/dev/register
```

We can use the the same cURL command for login, just change /register to /login at the end:

```bash
    curl -H "Content-Type: application/json" -X POST -d "{\"email\": \"test@example.com\", \"password\": \"test123\"}" https://abc1234567.execute-api.eu-central-1.amazonaws.com/dev/login
```

This should return a token:

```bash
{"auth":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRtYXhpbWluaUBnbWFpbC5jb20iLCJpZCI6ImI5Zjc2ZjUzLWVkNjUtNDk5Yi04ZTBmLTY0YWI5NzI4NTE0MCIsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNTgzMjE4OTk4LCJleHAiOjE1ODMzMDUzOTh9.noxR1hV4VIdnVKREkMUXvnUVUbDZzZH_-LYnjMGZcVY","status":"SUCCESS"}
```

This is the token we are going to use for requests to the protected API endpoints. Usually you would store this in a client side cookie and add it as an Authorization header to your future requests.

And finally, let's use the token to test our protected endpoint. We can pass in the custom header to curl by using the `-H` option:

     curl -H "Authorization: <your token>" https://myn3t4rsij.execute-api.eu-central-1.amazonaws.com/dev/me

When everything went well, it should return our user record:

```bash
{"passwordHash":"$2a$08$8bcT0Uvx.jMPBSc.n4qsD.6Ynb1s1qXu97iM9eGbDBxrcEze71rlK","createdAt":"Wed Mar 04 2020 12:25:52 GMT+0000 (Coordinated Universal Time)","email":"test@example.com","id":"2882851c-5f0a-479a-81a4-e709baf67383"}

```

## Conclusion

Congratulations. You've learned how to design and deploy a microservice to AWS Lambda with JWT authorization. If you made it this far please consider following me on [Twitter](https://twitter.com/tmaximini).
