import React from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';

import { parsePostDate } from '../../utils';

import DevTag from './DevTag';

const BPT = styled.li`
  margin-bottom: 3em;
  time {
    font-size: 0.875em;
    color: #777;
  }
  h2 {
    font-size: 1.5em;
    font-weight: 700;
    margin: 0 0 0.5em;
    padding: 0;
    line-height: 1.25;
  }
  a {
    cursor: pointer;
  }
  p {
    margin: 0.35em 0;
    color: #555;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
  }
`;

export default function BlogPostTeaser({ post }) {
  const date = parsePostDate(post.date);

  return (
    <BPT>
      <div>
        <time dateTime={date.toISOString()}>
          {format(date, 'MMM dd yyyy')}
        </time>{' '}
        <h2>
          <a href={post.path} title={post.title}>
            {post.title}
          </a>
        </h2>{' '}
        <div>
          <p>{post.subtitle}</p>
        </div>{' '}
        <ul className="tags">
          {post.tags && post.tags.map(tag => <DevTag tag={tag} />)}
        </ul>
      </div>
    </BPT>
  );
}
