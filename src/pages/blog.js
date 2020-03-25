import React from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import Section from '../components/Shared/Section/Section';
import BlogPostTeaser from '../components/Blog/BlogPostTeaser';
import Layout from '../components/Layout';
import Headline from '../components/Shared/Headline/Headline';
import SEO from '../components/seo';

const BlogOverview = styled.div`
  a {
    text-decoration: none;
  }

  h3 {
    margin-bottom: 0.725em;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`;

const BlogPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;

  const postsOrdered = posts.sort((a, b) =>
    a.node.frontmatter.date > b.node.frontmatter.date ? 1 : -1,
  );

  return (
    <Layout>
      <SEO title={`Blog`} />
      <Section
        style={{
          position: 'relative',
          padding: '40px 10px 10px 10px',
        }}
      >
        <Headline>Writings</Headline>
        <BlogOverview>
          <ul>
            {postsOrdered.reverse().map(post => (
              <BlogPostTeaser
                post={post.node.frontmatter}
                key={post.node.id}
              />
            ))}
          </ul>
        </BlogOverview>
      </Section>
    </Layout>
  );
};

export default BlogPage;

export const postsQuery = graphql`
  query AllBlogPosts {
    allMarkdownRemark(
      limit: 30
      sort: { fields: [frontmatter___date], order: ASC }
      filter: {
        frontmatter: { type: { eq: "post" }, published: { eq: true } }
      }
    ) {
      edges {
        node {
          id
          frontmatter {
            order
            path
            title
            subtitle
            published
            date
            year
            tags
          }
        }
      }
    }
  }
`;
