import React from 'react'
import Link from 'gatsby-link'
import Section from '../components/Shared/Section/Section'

const BlogPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <Section style={{ position: 'relative' }}>
      <h1>Blog</h1>
      {posts.map(p => (
        <Link key={p.node.id} to={p.node.frontmatter.path}>
          {p.node.frontmatter.title}
        </Link>
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
          }
        }
      }
    }
  }
`
