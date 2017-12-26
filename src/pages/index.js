import React from 'react'
import Link from 'gatsby-link'

import Profile from '../components/Profile/Profile'
import WorkOverview from '../components/Work/WorkOverview'

const IndexPage = ({ data }) => {
  const { edges: projects } = data.allMarkdownRemark
  console.info({ projects })
  return (
    <div>
      <Profile />
      <WorkOverview projects={projects.map(p => p.node)} />
    </div>
  )
}

export default IndexPage

export const workQuery = graphql`
  query AllProjects {
    allMarkdownRemark(
      limit: 10
      sort: { fields: [frontmatter___date], order: ASC }
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
                resize(width: 250) {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`
