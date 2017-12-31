import React from 'react'

import WorkOverview from '../components/Work/WorkOverview'
import Section from '../components/Shared/Section/Section'

const WorkPage = ({ data }) => {
  const { edges: projects } = data.allMarkdownRemark
  return (
    <Section>
      <WorkOverview noTopMargin projects={projects.map(p => p.node)} />
    </Section>
  )
}

export default WorkPage

export const workQuery = graphql`
  query AllProjects {
    allMarkdownRemark(
      limit: 10
      sort: { fields: [frontmatter___order], order: ASC }
      filter: { frontmatter: { type: { eq: "project" } } }
    ) {
      edges {
        node {
          id
          html
          frontmatter {
            path
            title
            date
            tech
            summary
            image {
              childImageSharp {
                sizes(maxWidth: 200) {
                  ...GatsbyImageSharpSizes
                }
              }
            }
          }
        }
      }
    }
  }
`
