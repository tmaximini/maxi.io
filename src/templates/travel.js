import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import { graphql } from 'gatsby'

import Layout from '../components/Layout'
import Section from '../components/Shared/Section/Section'

const Headline = styled.h1`
  text-align: center !important;
  @media screen and (max-width: 500px) {
    font-size: 1.62671rem;
  }
`

export default function Template({ data }) {
  const { markdownRemark: post } = data
  return (
    <Layout>
      <div>
        <Helmet>
          <title>{post.frontmatter.title} - Thomas Maximini</title>
          <meta name="keywords" content={post.frontmatter.keywords} />
        </Helmet>
        <Section>
          <Headline>{post.frontmatter.title}</Headline>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </Section>
      </div>
    </Layout>
  )
}

export const postQuery = graphql`
  query TravelPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
        date
        keywords
      }
    }
    allFile(filter: { relativeDirectory: { eq: "./photos" } }) {
      edges {
        node {
          id
          name
          relativePath
        }
      }
    }
  }
`
