import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import Image from 'gatsby-image'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  algin-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  blockquote {
    color: #aaa;
    font-style: italic;
  }
`

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
`

const InfoBox = styled.div`
  margin-bottom: 20px;
  h3 {
    margin-bottom: 10px;
    fonts-size: 1.2em;
  }
`

const FlexRight = styled(Flex)`
  @media screen and (min-width: 40em) {
    width: 30%;
    border-left: 1px solid #f2f2f2;
    padding-left: 10px;
  }
`

const ImgContainer = styled.div`
  height: 200px;
  width: 200px;
  @media screen and (min-width: 40em) {
    width: 400px;
    height: 400px;
  }
  * {
    height: 200px;
    width: 200px;
    @media screen and (min-width: 40em) {
      width: 400px;
      height: 400px;
    }
  }
`

const ProjectDetailInfo = ({ project }) => {
  const { title, tech, url, image, summary } = project.frontmatter

  return (
    <Wrapper>
      <Flex style={{ flexGrow: 2, paddingRight: '20px' }}>
        <h1>{title}</h1>
        <blockquote>"{summary}"</blockquote>
        <div dangerouslySetInnerHTML={{ __html: project.html }} />
      </Flex>
      <FlexRight>
        {url && (
          <InfoBox>
            <h3>Links</h3>
            <a target="_blank" href={url}>
              {url}
            </a>
          </InfoBox>
        )}
        <InfoBox>
          <h3>Technologies</h3>
          <ul>{tech.map(item => <li key={item}>{item}</li>)}</ul>
        </InfoBox>
      </FlexRight>
    </Wrapper>
  )
}
export default ProjectDetailInfo
