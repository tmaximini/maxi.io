import React from 'react'
import Helmet from 'react-helmet'
import Section from '../components/Shared/Section/Section'
import styled from 'styled-components'

require('prismjs/themes/prism-okaidia.css')

const Published = styled.span`
  display: block;
  color: #666666;
  font-size: 0.8em;
  font-style: italic;
`

export default function Template({ data }) {
  const { markdownRemark: post } = data
  // const post = data.markdownRemark;
  return (
    <div>
      <Helmet>
        <title>{post.frontmatter.title} - Thomas Maximini</title>
      </Helmet>
      <Section>
        <Published>{post.frontmatter.date}</Published>
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
        date
      }
    }
  }
`
