import React from 'react'
import styled from 'styled-components'
import { navigate } from 'gatsby'
import Image from 'gatsby-image'
import TechList from './TechList'

const Project = styled.li`
  margin: 20px auto;
  width: 100%;
  max-width: 40em;
  cursor: pointer;
  padding: 10px;
  @media screen and (min-width: 60em) {
    width: 50%;
    padding-right: 20px;
    margin: 0;
    margin-bottom: 40px;
  }
  overflow: hidden;
  h2,
  h3 {
    margin-top: 0;
  }
  transition: transform 0.11s linear;
  transition-delay: 0.2s;
  @media screen and (hover: hover) and (min-width: 960px) {
    &:hover {
      transform: scale(1.05);
    }
  }
`

const SubHeader = styled.h3`
  margin-bottom: 10px;
`

const Description = styled.div`
  text-align: left;
  width: calc(100% - 120px);
  color: rgba(0, 0, 0, 0.7);
  @media screen and (min-width: 40em) {
    width: calc(100% - 170px);
  }
  line-height: 1.65;
  overflow: hidden;
  p {
    text-overflow: ellipsis;
    margin: 10px 0;
  }
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`

const ImgContainer = styled.div`
  width: 100px;
  height: 100px;
  margin-right: 20px;
  box-shadow: #9c9c9c 0px 3px 7px 0;
  @media screen and (min-width: 40em) {
    width: 150px;
    height: 150px;
  }
  * {
    height: 100px;
    width: 100px;
    @media screen and (min-width: 40em) {
      width: 150px;
      height: 150px;
    }
  }
`

const ProjectTeaser = ({ project }) => (
  <Project onClick={() => navigate(project.frontmatter.path)}>
    <Flex>
      <ImgContainer>
        <Image fluid={project.frontmatter.image.childImageSharp.fluid} />
      </ImgContainer>
      <Description>
        <SubHeader>{project.frontmatter.title}</SubHeader>
        <p>{project.frontmatter.summary}</p>
        <TechList items={project.frontmatter.tech} />
      </Description>
    </Flex>
  </Project>
)

export default ProjectTeaser
