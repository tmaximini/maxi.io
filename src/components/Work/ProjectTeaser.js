import React from 'react'
import styled from 'styled-components'
import { navigateTo } from 'gatsby-link'
import Image from 'gatsby-image'
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
  position: relative;
`

const ImgContainer = styled.div`
  max-height: 250px;
  max-width: 250px;
  min-width: 200px;
  min-height: 200px;
  margin-right: 20px;
  @media screen and (min-width: 40em) {
    width: 150px;
    height: 150px;
  }
`

const ProjectTeaser = ({ project }) => (
  <Project onClick={() => navigateTo(project.frontmatter.path)}>
    <Flex>
      <ImgContainer>
        <Image sizes={project.frontmatter.image.childImageSharp.sizes} />
      </ImgContainer>
      <div>
        <h3>{project.frontmatter.title}</h3>
        <Description dangerouslySetInnerHTML={{ __html: project.html }} />
        <TechList items={project.frontmatter.tech} />
      </div>
    </Flex>
  </Project>
)

export default ProjectTeaser
