import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Section from '../components/Shared/Section/Section'
import styled from 'styled-components'

require('prismjs/themes/prism-okaidia.css')

const Published = styled.span`
  display: block;
  color: #666666;
  font-size: 0.8em;
  font-style: italic;
`

const Headline = styled.h1`
  text-align: left !important;
  @media screen and (max-width: 500px) {
    font-size: 1.62671rem;
  }
`

export default function Template({ data }) {
  const { markdownRemark: post } = data
  // const post = data.markdownRemark;
  return (
    <Layout>
      <div>
        <Helmet>
          <title>{post.frontmatter.title} - Thomas Maximini</title>
        </Helmet>
        <Section>
          <Published>{post.frontmatter.date}</Published>
          <Headline>{post.frontmatter.title}</Headline>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </Section>
      </div>
    </Layout>
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
