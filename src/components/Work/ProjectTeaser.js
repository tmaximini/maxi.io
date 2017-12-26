import React from 'react'
import styled from 'styled-components'
import { navigateTo } from 'gatsby-link'
import TechList from './TechList'

const Project = styled.li`
  margin: 20px auto;
  width: 100%;
  max-width: 40em;
  cursor: pointer;
  @media screen and (min-width: 60em) {
    width: 50%;
    padding-right: 20px;
    margin: 0;
    margin-bottom: 40px;
  }
  overflow: hidden;
`

const SubHeader = styled.h3`
  margin-bottom: 10px;
`

const Description = styled.div`
  text-align: left;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.65;
  max-height: 200px;
  overflow: hidden;
  p {
    text-overflow: ellipsis;
    margin: 10px 0;
  }
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`

const Img = styled.img`
  max-height: 250px;
  max-width: 250px;
  width: 100px;
  height: 100px;
  margin-right: 20px;
  @media screen and (min-width: 40em) {
    width: 150px;
    height: 150px;
  }
`

const ProjectTeaser = ({ project }) => (
  <Project onClick={() => navigateTo(project.frontmatter.path)}>
    <Flex>
      <Img src={project.frontmatter.image.childImageSharp.resize.src} />
      <Description>
        <SubHeader>{project.frontmatter.title}</SubHeader>
        <p>{project.frontmatter.summary}</p>
        <TechList items={project.frontmatter.tech} />
      </Description>
    </Flex>
  </Project>
)

export default ProjectTeaser
