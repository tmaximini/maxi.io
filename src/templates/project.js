import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import WorkOverview from '../components/Work/WorkOverview'
import Section from '../components/Shared/Section/Section'

export default function ProjectTemplate({ data, pathContext }) {
  const { markdownRemark: project } = data
  const { title, tech, url, date } = project.frontmatter
  const { prev, next } = pathContext
  console.info({ prev, next })
  return (
    <div>
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <Section>
        <h1>{title}</h1>
        <div>
          <Link to={prev.frontmatter.path}>prev: {prev.frontmatter.title}</Link>
          <Link to={next.frontmatter.path}>next: {next.frontmatter.title}</Link>
        </div>
        <div dangerouslySetInnerHTML={{ __html: project.html }} />
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
      }
    }
  }
`
