import React from 'react';

import styled from 'styled-components';

import * as Icons from '../Icons';

const getTagIcon = tag => {
  switch (tag.toLowerCase()) {
    case 'react':
      return <Icons.React />;
    case 'apollo':
      return <Icons.Apollo />;
    case 'typescript':
      return <Icons.Typescript />;
    case 'aws':
      return <Icons.AWS />;
    case 'serverless':
      return <Icons.Serverless />;
    case 'node':
      return <Icons.Node />;
    case 'jenkins':
      return <Icons.Jenkins />;
    case 'docker':
      return <Icons.Docker />;
    case 'angular':
      return <Icons.Angular />;
    case 'lambda':
      return <Icons.Lambda />;
  }
};

const IconTag = styled.li`
  font-size: 0.875em;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  span {
    margin-right: 4px;
  }
`;

export default function DevTag({ tag }) {
  return (
    <IconTag>
      <span>{getTagIcon(tag)}</span>
    </IconTag>
  );
}
