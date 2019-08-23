import React from "react";
import Helmet from "react-helmet";
import styled from "styled-components";
import { Link, graphql } from "gatsby";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Layout from "../components/Layout";
import WorkOverview from "../components/Work/WorkOverview";
import ProjectDetailInfo from "../components/Work/ProjectDetailInfo";
import Section from "../components/Shared/Section/Section";

const TopLinks = styled.div`
  width: 100%;
  margin: 20px auto;
  max-width: 62em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  display: none;

  a {
    text-decoration: none;
    font-size: 1.1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.15s ease-in;
    &:hover {
      transform: scale(1.1);
    }
  }
`;

export default function ProjectTemplate({ data, pageContext }) {
  const { markdownRemark: project } = data;
  const { prev, next } = pageContext;
  return (
    <Layout>
      <div>
        <Helmet>
          <title>Thomas Maximini - {project.frontmatter.title}</title>
        </Helmet>
        <TopLinks>
          <Link to={prev.frontmatter.path}>
            <FaChevronLeft />
            <span>{prev.frontmatter.title}</span>
          </Link>
          <Link to={next.frontmatter.path}>
            <span>{next.frontmatter.title}</span>
            <FaChevronRight />
          </Link>
        </TopLinks>
        <Section>
          <ProjectDetailInfo project={project} />
          <WorkOverview headline="Other projects" projects={[prev, next]} />
        </Section>
      </div>
    </Layout>
  );
}

export const projectQuery = graphql`
  query ProjectByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        tech
        url
        date
        title
        summary
        image {
          childImageSharp {
            fluid(maxWidth: 400) {
              src
              srcSet
              sizes
              base64
            }
          }
        }
      }
    }
  }
`;
