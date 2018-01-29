import React from 'react'
import Helmet from 'react-helmet'
import Section from '../components/Shared/Section/Section'

require('prismjs/themes/prism-okaidia.css')

export default function Template({ data }) {
  const { markdownRemark: post } = data
  // const post = data.markdownRemark;
  return (
    <div>
      <Helmet>
        <title>{post.frontmatter.title} - Thomas Maximini</title>
      </Helmet>
      <Section>
        <h1>{post.frontmatter.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Section>
    </div>
  )
}

export const postQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`
