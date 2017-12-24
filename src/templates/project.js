import React from 'react'
import Helmet from 'react-helmet'

export default function Template({ data }) {
  const { markdownRemark: project } = data
  const { title, tech, url, date } = project.frontmatter
  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: project.html }} />
      <ul>{tech.map(t => <li>{t}</li>)}</ul>
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
