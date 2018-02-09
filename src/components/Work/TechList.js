import React from 'react'
import styled from 'styled-components'

const TechList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-position: outside;
  list-style-type: circle;
  line-height: 1.3;
`

const TechItem = styled.li`
  font-style: italic;
  display: inline-block;
  list-style: circle;
  color: #666666;
  font-size: 0.8em;
  margin: 0;
  &:not(:last-child)::after {
    content: '•';
    padding: 0 0.3em;
  }
`

const Tech = ({ items }) => (
  <TechList>{items.map(item => <TechItem key={item}>{item}</TechItem>)}</TechList>
)

export default Tech
