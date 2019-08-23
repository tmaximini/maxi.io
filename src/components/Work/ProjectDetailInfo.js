import React from "react";
import styled from "styled-components";
import Image from "gatsby-image";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  algin-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  blockquote {
    color: #666666;
    font-style: italic;
    margin-left: 0;
  }
  h2,
  h3 {
    margin-top: 0;
  }
`;

const Flex = styled.div`
  width: 100%;
  @media screen and (min-width: 40em) {
    width: 70%;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    li {
      margin-bottom: 0;
    }
  }
`;

const InfoBox = styled.div`
  margin-bottom: 20px;
  h3 {
    margin-bottom: 10px;
    fonts-size: 1.2em;
  }
  a {
    font-size: 1.1em;
  }
`;

const FlexRight = styled(Flex)`
  @media screen and (min-width: 40em) {
    width: 30%;
    border-left: 1px solid #f2f2f2;
    padding-left: 10px;
  }
`;

const ImgContainer = styled.div`
  height: 200px;
  width: 200px;
  margin: 20px 0;
  @media screen and (min-width: 40em) {
    width: 300px;
    height: 300px;
  }
  * {
    height: 200px;
    width: 200px;
    @media screen and (min-width: 40em) {
      width: 300px;
      height: 300px;
    }
  }
`;

const DateEl = styled.div`
  font-size: 1.1em;
  margin: 0 0 20px 0;
`;

const ProjectDetailInfo = ({ project }) => {
  const { title, tech, url, image, summary, date } = project.frontmatter;

  return (
    <Wrapper>
      <Flex style={{ flexGrow: 2, paddingRight: "20px" }}>
        <h1 style={{ marginBottom: "20px" }}>{title}</h1>
        <DateEl>{date}</DateEl>
        <blockquote>"{summary}"</blockquote>
        <ImgContainer>
          <Image fluid={image.childImageSharp.fluid} />
        </ImgContainer>
        <div dangerouslySetInnerHTML={{ __html: project.html }} />
      </Flex>
      <FlexRight>
        {url && (
          <InfoBox>
            <h3>Links</h3>
            <a target="_blank" rel="noopener noreferrer" href={url}>
              {url}
            </a>
          </InfoBox>
        )}
        <InfoBox>
          <h3>Technologies</h3>
          <ul>
            {tech.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </InfoBox>
      </FlexRight>
    </Wrapper>
  );
};
export default ProjectDetailInfo;
