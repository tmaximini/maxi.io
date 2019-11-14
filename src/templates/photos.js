import React from "react";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import Layout from "../components/Layout";
import Section from '../components/Shared/Section/Section'
import GridItem from "../components/grid-item";
import PhotoGrid from '../components/photo-grid'
import SEO from '../components/seo'

const Photos = ({ data: { info, images } }) => {

  return (
    <Layout>
        <SEO title={`Travel Photos | ${info.title_detail}`} />
      <Section style={{ position: 'relative', paddingTop: '40px', maxWidth: '100%' }}>
        <h1 style={{ marginBottom: '1.45rem' }}>{info.title_detail}</h1>
        <PhotoGrid>
            {images.nodes.map(node => (
            <GridItem noEffect key={node.name}>
                <Img fluid={node.childImageSharp.fluid} />
            </GridItem>
            ))}
        </PhotoGrid>
      </Section>
    </Layout>
  );
};

export default Photos;

export const query = graphql`
  query PhotosTemplate($slug: String!, $images: String!) {
    info: travelYaml(slug: { eq: $slug }) {
      title_detail
      category
      desc
      slug
      parent {
        ... on File {
          modifiedTime
          birthTime
        }
      }
      cover {
        childImageSharp {
          resize(width: 1200, height: 675, quality: 80) {
            src
          }
        }
      }
    }
    images: allFile(
      sort: { fields: name }
      filter: { relativePath: { regex: $images } }
    ) {
      nodes {
        name
        extension
        childImageSharp {
          fluid(quality: 95, maxWidth: 1200) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  }
`;
