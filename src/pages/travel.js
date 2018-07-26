import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import Section from '../components/Shared/Section/Section'

const TravelOverview = styled.div`
  a {
    text-decoration: none;
  }

  a:hover {
    border-bottom: 1px solid;
  }

  h3 {
    margin-bottom: 0.725em;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
  }
`

const TravelPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  const groupedPosts = groupBy(posts, post => post.node.frontmatter.year)

  return (
    <Section style={{ position: 'relative', paddingTop: '40px' }}>
      <h1>Travel Diaries</h1>
      <TravelOverview>
        <ul>
          {posts
            .sort(function(a, b) {
              const aDate = a.node.frontmatter.date.split('.')
              const bDate = b.node.frontmatter.date.split('.')
              return (
                new Date(Date.UTC(bDate[2], bDate[1], bDate[0])) -
                new Date(Date.UTC(aDate[2], aDate[1], aDate[0]))
              )
            })
            .map(p => (
              <li key={p.node.id}>
                <Link to={p.node.frontmatter.path}>{`${p.node.frontmatter.date.split('.')[1]}/${
                  p.node.frontmatter.year
                } - ${p.node.frontmatter.title}`}</Link>
              </li>
            ))}
        </ul>
      </TravelOverview>
    </Section>
  )
}

export default TravelPage

export const postsQuery = graphql`
  query AllTravelPosts {
    allMarkdownRemark(
      limit: 20
      sort: { fields: [frontmatter___date], order: ASC }
      filter: { frontmatter: { type: { eq: "travel" }, published: { eq: true } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            path
            title
            published
            date
            year
          }
        }
      }
    }
  }
`
