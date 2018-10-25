import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import Section from '../components/Shared/Section/Section'
import doge from './404-doge.png'

const NotFoundPage = () => (
  <Layout>
    <Section style={{ position: 'relative' }}>
      <h1>Nothing here.</h1>
      <p style={{ textAlign: 'center' }}>
        That's a 404. You just hit a route that doesn&#39;t exist... Sorry about that.
      </p>
      <p style={{ textAlign: 'center' }}>
        <img
          src={doge}
          alt="doge 404"
          style={{ textAlign: 'center', borderRadius: '50%', height: '200px' }}
        />
      </p>
      <p style={{ textAlign: 'center' }}>
        <Link to="/">Back to Home</Link>
      </p>
    </Section>
  </Layout>
)

export default NotFoundPage
