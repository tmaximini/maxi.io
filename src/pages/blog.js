import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import groupBy from 'lodash/groupby'
import Section from '../components/Shared/Section/Section'

const BlogOverview = styled.div`
  a {
    text-decoration: none;
  }

  a:hover {
    border-bottom: 1px solid;
  }

  h3 {
    margin-bottom: 0.725em;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`

const BlogPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  const groupedPosts = groupBy(posts, post => post.node.frontmatter.year)

  return (
    <Section style={{ position: 'relative', paddingTop: '40px' }}>
      <h1>Writings</h1>
      {Object.keys(groupedPosts)

        .reverse()
        .map(year => (
          <BlogOverview key={year}>
            <h3>{year}</h3>
            <ul>
              {groupedPosts[year].sort((a, b) => (a.order < b.order ? 1 : -1)).map(p => (
                <li key={p.node.id}>
                  <Link to={p.node.frontmatter.path}>{p.node.frontmatter.title}</Link>
                </li>
              ))}
            </ul>
          </BlogOverview>
        ))}
    </Section>
  )
}

export default BlogPage

export const postsQuery = graphql`
  query AllBlogPosts {
    allMarkdownRemark(
      limit: 10
      sort: { fields: [frontmatter___date], order: ASC }
      filter: { frontmatter: { type: { eq: "post" }, published: { eq: true } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            path
            title
            published
            date
            year
          }
        }
      }
    }
  }
`
