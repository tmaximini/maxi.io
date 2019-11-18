import React from "react";
import { Link, graphql } from "gatsby";
import Img from "gatsby-image";

import Layout from "../components/Layout";
import Section from "../components/Shared/Section/Section";
import GridItem from "../components/grid-item";
import PhotoGrid from "../components/photo-grid";
import SEO from "../components/seo";
import { MONTH_NAMES } from "../constants";

const TravelPage = ({ data: { entries } }) => {
  const posts = entries.nodes.reverse();

  return (
    <Layout>
      <SEO title={`Travel Photos`} />
      <Section
        style={{ position: "relative", paddingTop: "40px", maxWidth: "100%" }}
      >
        <h1 style={{ marginBottom: "1.45rem" }}>Travel Diaries</h1>
        <PhotoGrid>
          {posts.map(photo => (
            <GridItem key={photo.slug}>
              <Img fluid={photo.cover.childImageSharp.fluid} />
              <div className="table">
                <div className="vert-center">
                  <h2>{photo.title_detail}</h2>
                  <Link
                    to={photo.slug}
                    aria-label={`View photo "${photo.title_detail}"`}
                    className="show-gallery"
                  >
                    <span>View Photos</span>
                  </Link>
                </div>
              </div>
            </GridItem>
          ))}
        </PhotoGrid>
      </Section>
    </Layout>
  );
};

export default TravelPage;

export const postsQuery = graphql`
  query AllTravelPosts {
    entries: allTravelYaml {
      nodes {
        title
        title_detail
        slug
        cover {
          childImageSharp {
            fluid(quality: 95, maxWidth: 1200) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;
