import React from 'react'
import styled from 'styled-components'
import ProjectTeaser from './ProjectTeaser'

const WorkOverviewWrapper = styled.section`
  margin: 40px 0;
  z-index: -1;
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
  return (
    <WorkOverviewWrapper>
      <ProjectList>
        {projects.map(p => (
          <ProjectTeaser project={p} key={p.id} />
        ))}
      </ProjectList>
    </WorkOverviewWrapper>
  )
}

export default WorkOverview
