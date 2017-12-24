import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'

const Project = styled.li`
  margin: 20px auto;
  width: 100%;
  max-width: 40em;
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

const ProjectTeaser = ({ project }) => (
  <Project>
    <h3>{project.node.frontmatter.title}</h3>
    <Description dangerouslySetInnerHTML={{ __html: project.node.html }} />
    <Link to={project.node.frontmatter.path}>Details</Link>
  </Project>
)

export default ProjectTeaser
