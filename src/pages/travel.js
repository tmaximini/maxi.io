import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import Section from '../components/Shared/Section/Section'
import { MONTH_NAMES } from '../constants'

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
  table {
    border: 0;
    td {
      border: 0;
      width: 50%;
      padding: 5px;
      &:nth-child(odd) {
        color: #587a7b;
        text-align: right;
        font-size: 0.8em;
      }
    }
  }
`

const TravelPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  const groupedPosts = groupBy(posts, post => post.node.frontmatter.year)
  return (
    <Section style={{ position: 'relative', paddingTop: '40px' }}>
      <h1>Travel Diaries</h1>
      <TravelOverview>
        <table>
          <tbody>
            {posts
              .sort(function(a, b) {
                const aDate = a.node.frontmatter.date.split('.')
                const bDate = b.node.frontmatter.date.split('.')
                return (
                  new Date(Date.UTC(bDate[2], bDate[1], bDate[0])) -
                  new Date(Date.UTC(aDate[2], aDate[1], aDate[0]))
                )
              })
              .map(p => {
                const { date, path, title, year } = p.node.frontmatter
                const month = parseInt(date.split('.')[1]) - 1
                return (
                  <tr key={p.node.id}>
                    <td className="color">
                      <span>
                        {MONTH_NAMES[month]} {year}
                      </span>
                    </td>
                    <td>
                      <Link to={path}>{` ${title}`}</Link>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
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
