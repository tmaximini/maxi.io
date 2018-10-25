import React from 'react'

import Layout from '../components/Layout'
import Profile from '../components/Profile/Profile'
import Section from '../components/Shared/Section/Section'

const IndexPage = () => (
  <Layout>
    <Section style={{ position: 'relative' }}>
      <Profile />
    </Section>
  </Layout>
)

export default IndexPage
