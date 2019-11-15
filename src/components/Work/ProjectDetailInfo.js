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
    display: block;
    width: 100%;
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
  width: 100%;
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
  max-height: 400px;
  
  margin: 20px auto;
  text-align: center;
  @media screen and (min-width: 40em) {
    width: 400px;
    height: 400px;
  }
  * {
    height: 300px;
    width: 300px;
    @media screen and (min-width: 40em) {
      width: 400px;
      height: 400px;
    }
  }
`;

const DateEl = styled.div`
  font-size: 1em;
  margin: 0 0 20px 0;
  color: #848484;
  display: block;
  width: 100%;
  font-style: italic;
  `;

const Tech = styled.ul`
display: flex;
flex-direction: row;
justify-content: flex-start;
overflow-x: scroll;
padding: 10px 0;
margin-right: 10px;
width: 100%;
list-style: none;
margin: 0;
`

const Technology = styled.li`
  border-radius: 3px;
  border: 1px solid #848484;
  color: #848484;
  padding: 4px 8px 4px 8px;
  position: relative;
  margin: 0 10px 10px 0;
`

const ImageEl = styled(Image)`
  box-shadow: #9c9c9c 0 5px 15px 0;
`

const ProjectDetailInfo = ({ project }) => {
  const { title, tech, url, image, summary, date } = project.frontmatter;

  return (
    <Wrapper>
        <h1 style={{ marginBottom: "20px" }}>{title}</h1>
        
        <blockquote>"{summary}"</blockquote>
        <ImgContainer>
          <ImageEl fluid={image.childImageSharp.fluid} />
        </ImgContainer>
        <div dangerouslySetInnerHTML={{ __html: project.html }} />
        {url && (
          <InfoBox>
            <a target="_blank" rel="noopener noreferrer" href={url}>
              {url}
            </a>
          </InfoBox>
        )}
        <InfoBox>
          
          <Tech>
            {tech.map(item => (
              <Technology key={item}>{item}</Technology>
            ))}
          </Tech>
          <DateEl>{date}</DateEl>
        </InfoBox>
    </Wrapper>
  );
};
export default ProjectDetailInfo;
