import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import ProjectTeaser from './ProjectTeaser'

const WorkOverviewWrapper = styled.section`
  margin: 40px 0;
  z-index: -1;
`

const Headline = styled.h2`
  font-size: 1.5em;
  text-align: center;
  margin-bottom: 20px;
  @media screen and (min-width: 40em) {
    margin-bottom: 40px;
  }
`

const ProjectList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
  list-style: none;
  max-width: 62em;
  margin: 0 auto;
`

const WorkOverview = ({ projects, headline = 'Work' }) => {
  console.info({ projects })
  return (
    <WorkOverviewWrapper>
      <Headline>{headline}</Headline>
      <ProjectList>{projects.map(p => <ProjectTeaser project={p} key={p.id} />)}</ProjectList>
    </WorkOverviewWrapper>
  )
}

export default WorkOverview
