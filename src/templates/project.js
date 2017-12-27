import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Link from 'gatsby-link'
import WorkOverview from '../components/Work/WorkOverview'
import ProjectDetailInfo from '../components/Work/ProjectDetailInfo'
import Section from '../components/Shared/Section/Section'

const TopLinks = styled.div`
  width: 100%;
  padding: 10px 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export default function ProjectTemplate({ data, pathContext }) {
  const { markdownRemark: project } = data
  const { prev, next } = pathContext
  console.info({ prev, next })
  return (
    <div>
      <Helmet>
        <title>{project.frontmatter.title}</title>
      </Helmet>

      <Section>
        <TopLinks>
          <Link to={prev.frontmatter.path}>prev: {prev.frontmatter.title}</Link>
          <Link to={next.frontmatter.path}>next: {next.frontmatter.title}</Link>
        </TopLinks>
        <ProjectDetailInfo project={project} />
        <WorkOverview headline="Other projects" projects={[prev, next]} />
      </Section>
    </div>
  )
}

export const projectQuery = graphql`
  query ProjectByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        tech
        url
        date
        title
        summary
        image {
          childImageSharp {
            sizes(maxWidth: 400) {
              src
              srcSet
              sizes
              base64
            }
          }
        }
      }
    }
  }
`
