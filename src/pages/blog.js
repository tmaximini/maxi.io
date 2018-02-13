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
`

const BlogPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  const groupedPosts = groupBy(posts, post => post.node.frontmatter.year)

  console.info({ groupedPosts })

  return (
    <Section style={{ position: 'relative' }}>
      <h1>Blog</h1>
      {Object.keys(groupedPosts).map(year => (
        <BlogOverview>
          <h3>{year}</h3>
          {groupedPosts[year].map(p => (
            <Link key={p.node.id} to={p.node.frontmatter.path}>
              {p.node.frontmatter.title}
            </Link>
          ))}
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
