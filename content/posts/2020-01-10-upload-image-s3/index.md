---
order: 4
path: '/upload-images-to-aws-s3-with-react-and-apollo-graphql'
title: 'Upload images to AWS S3 with React and Apollo GraphQL'
subtitle: 'Simple file uploads with react-dropzone'
published: true
date: '20200110'
type: 'post'
keywords: 'GraphQL, Apollo, AWS, S3, Image Upload'
tags:
  - React
  - AWS
year: 2020
---

I recently found the need to add an image upload to a form for user avatars. The app I am building uses Apollo GraphQL so here I will share my solution with you.

## Client Side form

As in most of my projects, I am using React on the client side.
I assume you've already set up Apollo Client successfully on the client, so we just dive right into the image upload.

We are going to need the `useMutation` hook from `@apollo/react-hooks` as well as the `useDropzone` hook from [react-dropzone](https://react-dropzone.netlify.com/).

The client side component looks like this:

```jsx
import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import styled from '@emotion/styled';

// just some styled components for the image upload area
const getColor = props => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${props => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const thumbsContainer = {
  display: 'flex',
  marginTop: 16,
};

const thumbStyle = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

const errorStyle = {
  color: '#c45e5e',
  fontSize: '0.75rem',
};

// relevant code starts here
const uploadFileMutation = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      Location
    }
  }
`;

const Upload = ({ register }) => {
  const [preview, setPreview] = useState();
  const [errors, setErrors] = useState();
  const [uploadFile, { data }] = useMutation(uploadFileMutation);
  const onDrop = useCallback(
    async ([file]) => {
      if (file) {
        setPreview(URL.createObjectURL(file));
        uploadFile({ variables: { file } });
      } else {
        setErrors(
          'Something went wrong. Check file type and size (max. 1 MB)',
        );
      }
    },
    [uploadFile],
  );
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    maxSize: 1024000,
  });

  const thumb = (
    <div style={thumbStyle}>
      <div style={thumbInner}>
        <img src={preview} style={img} />
      </div>
    </div>
  );

  return (
    <Container
      {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drop file here, or click to select the file</p>
      )}
      {preview && <aside style={thumbsContainer}>{thumb}</aside>}
      {errors && <span style={errorStyle}>{errors}</span>}
      {data && data.uploadFile && (
        <input
          type="hidden"
          name="avatarUrl"
          value={data.uploadFile.Location}
          ref={register}
        />
      )}
    </Container>
  );
};

export default Upload;
```

Notice that I am creating a _preview_ of the image I am about to upload and save it in the component's state:

```js
setPreview(URL.createObjectURL(file));
```

I also added a hidden input field where I store the image's location (our AWS S3 bucket + file path) after uploading the image so I can associate the image with the user record in my form.

```jsx
<input
  type="hidden"
  name="avatarUrl"
  value={data.uploadFile.Location}
  ref={register}
/>
```

The `ref={register}` here registers the component to my form - this is done by [react-hook-form](https://react-hook-form.com/) and I pass in the `register` function from the parent (the form) component.
So much for the client side part of the application. Now let's have a look at the server side for uploading the images to our AWS S3 bucket.

## The GraphQL server part

So somewhere we need to have an Apollo Graphql server running that handles our `uploadImage` mutation. I have setup a [simple serverless Apollo server on AWS Lambda](https://www.thomasmaximini.com/build-a-serverless-graphlql-api-with-apollo-server-on-aws-lambda). Let's say in our schema we have the following mutations:

```js
  type Mutation {
    createUser(
      username: String!
      email: String!
      avatarUrl: String
    ): User!
    uploadFile(file: Upload!): S3Object
  }
```

The `uploadFile` mutation takes a single file argument of type `Upload!` and returns an _S3Object_.
The S3Object is just a type that I defined from the return values that `s3.upload(...)` gives us. It looks like this:

```js
  type S3Object {
    ETag: String
    Location: String!
    Key: String!
    Bucket: String!
  }
```

The important part here for our purpose is the `Location` field. It contains the absolute path to the uploaded image on S3.

So let's add the resolver function:

```js
const resolvers = {
  Query: {
    // ...
  },
  Mutation: {
    // ...
    uploadFile: async (parent, { file }) => {
      const response = await handleFileUpload(file);

      return response;
    },
  },
};
```

The `handleFileUpload` method is imported from my resolvers file and handles the file upload to S3.

The code looks like this:

```js
const AWS = require('aws-sdk');
// store each image in it's own unique folder to avoid name duplicates
const uuidv4 = require('uuid/v4');
// load config data from .env file
require('dotenv').config();
// update AWS config env data
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3({ region: process.env.AWS_REGION });

// my default params for s3 upload
// I have a max upload size of 1 MB
const s3DefaultParams = {
  ACL: 'public-read',
  Bucket: process.env.S3_BUCKET_NAME,
  Conditions: [
    ['content-length-range', 0, 1024000], // 1 Mb
    { acl: 'public-read' },
  ],
};

// the actual upload happens here
const handleFileUpload = async file => {
  const { createReadStream, filename } = await file;

  const key = uuidv4();

  return new Promise((resolve, reject) => {
    s3.upload(
      {
        ...s3DefaultParams,
        Body: createReadStream(),
        Key: `${key}/${filename}`,
      },
      (err, data) => {
        if (err) {
          console.log('error uploading...', err);
          reject(err);
        } else {
          console.log('successfully uploaded file...', data);
          resolve(data);
        }
      },
    );
  });
};
```

## Conclusion

So now, every time an image get's selected or dropped on the dropzone in the form, the `uploadImage` mutation gets called and the image gets immediately uploaded in the background.
The image's location get's stored in a hidden input field as soon as the upload has finished so the `createUser` mutation can store the location as part of the user record.
Thanks to [Ben Awad](https://github.com/benawad/apollo-server-react-file-upload) for the initial inspiration.
