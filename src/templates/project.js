import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import Link from 'gatsby-link'
import ChevronLeft from 'react-icons/lib/fa/angle-left'
import ChevronRight from 'react-icons/lib/fa/angle-right'
import WorkOverview from '../components/Work/WorkOverview'
import ProjectDetailInfo from '../components/Work/ProjectDetailInfo'
import Section from '../components/Shared/Section/Section'

const TopLinks = styled.div`
  width: 100%;
  margin: 20px auto;
  max-width: 62em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: none;

  a {
    text-decoration: none;
    font-size: 0.9em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.15s ease-in;
    &:hover {
      transform: scale(1.1);
    }
  }
`

export default function ProjectTemplate({ data, pathContext }) {
  const { markdownRemark: project } = data
  const { prev, next } = pathContext
  return (
    <div>
      <Helmet>
        <title>{project.frontmatter.title}</title>
      </Helmet>
      <TopLinks>
        <Link to={prev.frontmatter.path}>
          <ChevronLeft />
          <span>{prev.frontmatter.title}</span>
        </Link>
        <Link to={next.frontmatter.path}>
          <span>{next.frontmatter.title}</span>
          <ChevronRight />
        </Link>
      </TopLinks>
      <Section>
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
