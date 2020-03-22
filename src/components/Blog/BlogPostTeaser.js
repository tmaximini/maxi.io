import React from 'react';
import { format } from 'date-fns';
import styled from 'styled-components';

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
    &:hover {
      color: blue;
    }
  }
  p {
    margin: 0.5em 0;
  }
  .tags {
    display: flex;
    li {
      font-size: 0.875em;
      margin-right: 10px;
      color: #777;
      font-style: italic;
    }
  }
`;

export default function BlogPostTeaser({ post }) {
  const date = new Date(
    post.date.substr(0, 4),
    parseInt(post.date.substr(4, 2) - 1),
    post.date.substr(6, 2),
  );

  return (
    <BPT>
      <div>
        <time dateTime={date.toString()}>
          {format(date, 'MMM dd yyyy')}
        </time>{' '}
        <h2>
          <a>{post.title}</a>
        </h2>{' '}
        <div>
          <p>{post.subtitle}</p>
        </div>{' '}
        <ul className="tags">
          {post.tags &&
            post.tags.map(tag => (
              <li>
                <a href={`tags/${tag}`}>{tag}</a>
              </li>
            ))}
        </ul>
      </div>
    </BPT>
  );
}
