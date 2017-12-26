import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import WorkOverview from '../components/Work/WorkOverview'

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
      <h1>{title}</h1>
      <div>
        <Link to={prev.frontmatter.path}>prev: {prev.frontmatter.title}</Link>
        <Link to={next.frontmatter.path}>next: {next.frontmatter.title}</Link>
      </div>
      <div dangerouslySetInnerHTML={{ __html: project.html }} />
      <ul>{tech.map(t => <li key={t}>{t}</li>)}</ul>
      <WorkOverview headline="Other projects" projects={[prev, next]} />
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
