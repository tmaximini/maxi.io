import React from 'react'
import styled from 'styled-components'

const TechList = styled.ul`
  margin: 0;
  padding: 0;
`

const TechItem = styled.li`
  font-style: italic;
  display: inline-block;
  padding-right: 10px;
`

const Tech = ({ items }) => (
  <TechList>{items.map(item => <TechItem key={item}>{item}</TechItem>)}</TechList>
)

export default Tech
