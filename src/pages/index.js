import React from 'react'
import Link from 'gatsby-link'

import Profile from '../components/Profile/Profile'

const IndexPage = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark
  return (
    <div>
      <Profile />
    </div>
  )
}

export default IndexPage
