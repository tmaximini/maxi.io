import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import WorkOverview from '../components/Work/WorkOverview';
import Section from '../components/Shared/Section/Section';
import Headline from '../components/Shared/Headline/Headline';
import SEO from '../components/seo';

const WorkPage = ({ data }) => {
  const { edges: projects } = data.allMarkdownRemark;
  return (
    <Layout>
      <SEO title={`Selected Work`} />
      <Section style={{ position: 'relative', paddingTop: '40px' }}>
        <Headline>Work</Headline>
        <WorkOverview projects={projects.map(p => p.node)} />
      </Section>
    </Layout>
  );
};

export default WorkPage;

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
                fluid(maxWidth: 500) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`;
