import React from 'react'
import Helmet from 'react-helmet'
import Section from '../components/Shared/Section/Section'
import styled from 'styled-components'

// const Published = styled.span`
//   display: block;
//   color: #666666;
//   font-size: 0.8em;
//   font-style: italic;
// `

const Headline = styled.h1`
  text-align: center !important;
  @media screen and (max-width: 500px) {
    font-size: 1.62671rem;
  }
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
        <Headline>{post.frontmatter.title}</Headline>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Section>
    </div>
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
