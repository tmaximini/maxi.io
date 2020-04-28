---
order: 1
path: '/build-a-serverless-graphlql-api-with-apollo-server-on-aws-lambda'
title: 'Serverless GraphQL APIs with Node.js and Apollo'
subtitle: 'Run your Apollo as a Lambda'
published: true
date: '20191210'
type: 'post'
keywords: 'GraphQL, Apollo, AWS, serverless, DynamoDB'
tags:
  - Apollo
  - Serverless
year: 2019
---

![Umbrellas](umbrellas.jpg '@@jj_89 unsplash.com')
<span style="font-size: 11px;">Photo by Jakub Jacobsky on Unsplash</span>

## Why serverless

What are the advantages of a serverless api?

1. Pay as you go: We have zero initial costs and pay only for what we actually use. So while we develop our app, we have close to zero costs, and depending on how it develops it will scale automatically when traffic increases.
2. Infinite Scaling: We don't have to deal with infrastructure or servers, so when our requests suddenly goes from 0 to 1000s of requests per second, it won't be a problem because the serverless api will scale automatically for us. (AWS handles that in the background)
3. Faster development: We don't have to deal with managing , installing and configuring servers, or with deployment processes, so we can just focus on the business logic and building our app.

Serverless might not be the answer for all our problems but an GraphQL server seems like a great use case, so let's dive right in.

## Architecture

There are multiple providers for serverless functions, but the biggest and most famous one is [AWS Lambda](https://aws.amazon.com/lambda/). This is the one we will be using here.
Other famous examples providers are [Azure Functions](https://azure.microsoft.com/en-us/services/functions/), [Google Cloud Functions](https://cloud.google.com/functions/) and [Cloudflare Workers](https://www.cloudflare.com/products/cloudflare-workers/).

To make our lives easier we are going to leverage [the serverless framework](https://serverless.com/) for automating our deploys, so we can just define our deployment configuration in a `serverless.yml` file and don't need to worry about manual deployment.
Therefore we should install the serverless cli globally using `npm install -g serverless`. This installs a global cli tool which can be invoked by `serverless` or `sls`.

As a GraphQL server we are using [Apollo](https://www.apollographql.com/), which is also one of the most famous graqhql clients and servers. Apollo Client now fully [supports](https://www.apollographql.com/docs/react/api/react-hooks/) [React Hooks](https://reactjs.org/docs/hooks-intro.html) which is one of the reasons I love using it.
The server-side implementation with Apollo is also very straightforward and they offer an [AWS Lambda compatible package](https://www.apollographql.com/docs/apollo-server/deployment/lambda/), `apollo-server-lambda`, which we are going to use in this tutorial.

## Pre-Requisites

You should have an AWS Account and the [AWS cli](https://aws.amazon.com/de/cli/) installed.
You should have run `aws configure` and setup your local machine with the AWS Access Key ID and AWS Secret Access Key from an IAM user with privileges to access DynamoDB.

## The Apollo Server

GraphQL comes with a default UI, the grahiQL client, which gives us the possibility to inspect a schema and to request data from an API. Apollo Server also mocks our schema by default, so the initial setup of our GraphQL server is very compact - there is not much code needed at all to get started.

Assuming we are in a fresh project folder.

```bash
mkdir graphql-serverless-example
cd graphql-serverless-example
npm init -y\
```

First, let's do an

```bash
npm install apollo-server apollo-server-lambda graphql
```

I install both apollo-server and apollo-server-lambda here, because I want to develop most of the time locally and deploy to lambda every once in a while. Both the local and the lambda versions are going to use the same _schema_, so let's create a file `grapqhl/schema.js` from which we can then export our schema.

```js
// schema.js
const { gql } = require('apollo-server-lambda');

const typeDefs = gql`
  type Image {
    source: String # Url scalar
    description: String
    thumbnailSource(width: Int, height: Int): String # Url scalar
  }

  enum Currency {
    EUR
    CHF
    USD
  }

  type Price {
    amount: Int
    currency: Currency
  }

  type Product @cacheControl(maxAge: 300) {
    id: ID!
    name: String
    description: String
    image: Image
    brand: String
    price: Price
  }

  type Query {
    product(id: ID!): Product
  }
`;

const resolvers = {};

const mocks = {};

module.exports = {
  typeDefs,
  resolvers,
  mocks,
  mockEntireSchema: true,
};
```

This defines a fairly simple schema for `Product` which might resemble some form of e-commerce article data.

For quicker local development, we create a file `local.js`, where we import ApolloServer and our schema and fire up a local instance.

```js
// local.js
const { ApolloServer } = require('apollo-server');

const { typeDefs, resolvers, mocks } = require('./graphql/schema');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
  mockEntireSchema: false,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

For local development we will `npm install --save-dev nodemon` and add a npm script to our `package.json`:

```
"scripts": {
    "dev": "nodemon local.js"
  }
```

This will automatically restart the apollo-server in `local.js` whenever we change any files.

Fot the serverless function we create a file `lambda.js` with the following content:

```js
// lambda.js
const { ApolloServer } = require('apollo-server-lambda');

const { typeDefs, resolvers, mocks } = require('./graphql/schema');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks,
  mockEntireSchema: false,
  context: ({ event, context }) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
  }),
});

module.exports = {
  server,
};
```

This one is very similar to the `local.js` development server, except that we import `ApolloServer` from the `apollo-server-lambda` package now and we add some extra context object to the constructor (more on that later). We just export the the ApolloServer instance here again.

Now create another file, `index.js`, where we import said server.

```js
// index.js
const { ApolloServer } = require('apollo-server-lambda');

const schema = require('./graphql/schema');

const server = new ApolloServer(schema);

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: false,
  },
  endpointURL: '/graphql',
});
```

Now create the `serverless.yml` file.

```yaml
org: tmaximini
app: apollo-lambda-app
service: apollo-lambda
provider:
  name: aws
  runtime: nodejs10.x
  region: eu-central-1
iamRoleStatements:
  Effect: 'Allow'
  Action:
    - 'dynamodb:GetItem'
    - 'dynamodb:PutItem'
    - 'dynamodb:Scan'
  Resource: '*'
functions:
  graphql:
    # this is formatted as <FILENAME>.<HANDLER>
    handler: index.graphqlHandler
    events:
      - http:
          path: graphql
          method: get
          cors: true
          integration: lambda-proxy
```

What is going on here? Serverless framework is configured using a [yaml file](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/) - the most important point here are:

- we want to use AWS as a provider (Lambda) with a nodejs runtime of version 10.x
- we want to run it in `eu-central-01` region (You might want to change that depending on your location)
- we need some [IAM policies](https://serverless.com/framework/docs/providers/aws/guide/iam/)
- most importantly, we we tell serverless which functions should correspond to which endpoints: Here we have a function (we call it graphql) that uses the handler `index.graphqlHandler`, this means _go check index.js for a function called graphqlHandler_ and then use this for the following event definitions, in our case a simple `http get` with a path of `/graphql`.

## The first test

Let's run `npm run dev` and the local development server should start up:

```bash
🚀 Server ready at http://localhost:4000/
```

Now visit http://localhost:4000 and confirm everything works, you should see a GraphQL Playground.

![localhost:4000 GraphQL Playground](localhost.png ' GraphQL Playground')
<span style="font-size: 11px;">Our GraphQL Playground at localhost:4000</span>

As ApolloServer mocks everything by default, you can now run your first test query against the server:

```graphql
{
  product(id: "123") {
    name
    brand
    price {
      amount
      currency
    }
  }
}
```

## Fetching real data

Now if we want to display actual data, not just mock data, we have to write [some resolvers](https://www.apollographql.com/docs/apollo-server/data/data/).

As we want to stay serverless, we use AWS DynamoDB as a data layer in this example. DynamoDB is a "serverless" NoSQL Database service from AWS, that can handle large amounts of data easily and where [we only pay for what we use](https://aws.amazon.com/dynamodb/pricing/).

To communicate with the DynamoDB locally, we need a `.env` file where we add the following information:

```
AWS_ACCCES_ID=<your access id>
AWS_SECRET_KEY=<your secret key>
AWS_REGION=<your region>
```

_Make sure the `.env` file is git ignored and never gets checked into version control, as it contains sensitive information._

Now let's write our first resolver in `resolvers/article.js`.

```js
const AWS = require('aws-sdk');

// this flag is set when the process runs on AWS lambda
// so we can use it to determine if we run on AWS or not
const isLambda = !!(process.env.LAMBDA_TASK_ROOT || false);

// if we are local, add env vars to communicate with DynamoDB
if (!isLambda) {
  require('dotenv').config();
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
  });
}

// we might need to transform the data from the DB format to
// whatever format works best for our client apps
const { transformArticle } = require('../transformers/article');

// INIT AWS
const docClient = new AWS.DynamoDB.DocumentClient();

// default DynamoDB params to be extended
const defaultParams = {
  // our DynamoDB table name
  TableName: 'Articles',
  // the attributes that we want to get from that table
  AttributesToGet: [
    'ID',
    'Name',
    'Producer',
    'Description',
    'Price',
    'Images',
  ],
};

// promisified generic getter
const getByParams = params =>
  new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        console.log('error getting from dynamodb', err);
        reject(err);
      } else {
        // transform the DB result to desired format before returning
        const result = transformArticle(data.Item);
        console.log('yay got data from dynamodb', result);
        resolve(result);
      }
    });
  });

// our resolver function
const getArticleById = async id => {
  const params = {
    ...defaultParams,
    Key: {
      ID: id,
    },
  };

  return getByParams(params);
};

module.exports = {
  getArticleById,
};
```

The transformer function might look something like this - this really depends on your use case! You might not even need one depending on your data model.

```js
const transformArticle = item => {
  return {
    id: item.ID,
    name: item.Name,
    image: item.Images.Image.Link,
    brand: item.Producer,
    slug: item.Slug,
    price: item.Price,
    description: Array.isArray(item.Translations)
      ? item.Translations[0].DescriptionLong
      : item.Translations.DescriptionLong || 'no description yet',
  };
};

module.exports = {
  transformArticle,
};
```

Now with our resolver in place, we can jump back into `schema.js` and actually use it:

```js
// ...
const { getArticleById } = require('../resolvers/article');
// ...
const resolvers = {
  Query: {
    product(obj, args, context, info) {
      return getArticleById(args.id);
    },
  },
  Product: {
    price: obj => ({
      amount: obj.price,
      currency: 'EUR',
    }),
  },
};
// ...
```

We imported our resolver function and used it in the `Query` object of the resolvers object. the second argument, `args`, contains the request argumens, in this case `id`.

Nested resolvers, such as Product.price, get the parent object passed in as a first argument. This is pretty neat as it let's us abstract oder schema further into re-usable sub types, such as `Price`.

## Deployment to serverless

Now you can run `sls deploy` and the project gets packaged and deployed to AWS Lambda. Your output should look something like this:

![serverless deployment](sls.png 'serverless deployment')
<span style="font-size: 11px;">Our serverless deployment</span>

## Conclusion

Serverless technologies are changing the way we develop our applications. The fact that we don't need to think about infrastructure or optimise for later scaling gives us the possibility to laser focus on our apps. Another big plus is the low entry costs and not paying for any idle servers, we only pay for what is being executed. The downsides might be vendor lock-in into AWS, Google etc, because smaller businesses can just not compete with the services offered by large data centers of these providers.

You can find the code of this example [on my Github](https://github.com/tmaximini/graphql-apollo-serverless-example).

_This post was also published on [Medium](https://medium.com/@tmaximini/building-a-serverless-graphql-api-with-node-js-aws-lambda-and-apollo-b5796ab24727)._
