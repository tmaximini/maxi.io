import React from 'react';

import Layout from '../components/Layout';
import Uses from '../components/Uses/Uses';
import Section from '../components/Shared/Section/Section';
import SEO from '../components/seo';
import Headline from '../components/Shared/Headline/Headline';

const UsesPage = () => (
  <Layout>
    <SEO title={`What I use`} />
    <Section style={{ position: 'relative' }}>
      <Headline>Things I use</Headline>
      <Uses />
    </Section>
  </Layout>
);

export default UsesPage;
