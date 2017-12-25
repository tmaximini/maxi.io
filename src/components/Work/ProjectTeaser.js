import React from 'react'
import styled from 'styled-components'
import { navigateTo } from 'gatsby-link'

const Project = styled.li`
  margin: 20px auto;
  width: 100%;
  max-width: 40em;
  cursor: pointer;
  @media screen and (min-width: 60em) {
    width: 50%;
    padding-right: 20px;
    margin: 0;
  }
`

const Description = styled.div`
  text-align: left;
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.65;
`

const Flex = styled.div`
  display: flex;
  flex-direction: row;
`

const Img = styled.img`
  flex: 1;
  flex-grow: 0;
  max-height: 250px;
  max-width: 250px;
  width: 100%;
  margin-right: 20px;
  @media screen and (min-width: 60em) {
    max-width: 200px;
    max-height: 200px;
  }
`

const ProjectTeaser = ({ project }) => (
  <Project onClick={() => navigateTo(project.frontmatter.path)}>
    <h3>{project.frontmatter.title}</h3>
    <Flex>
      <Img src={project.frontmatter.image.childImageSharp.resize.src} />
      <Description dangerouslySetInnerHTML={{ __html: project.html }} />
    </Flex>
  </Project>
)

export default ProjectTeaser
