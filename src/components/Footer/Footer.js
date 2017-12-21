import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

const FooterWrapper = styled.footer`
  background: #fafafa;
  color: rgba(0, 0, 0, 0.7);
  border-top: 1px solid #f2f2f2;
  padding: 40px;
`

const CopyRight = styled.h3`
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  font-weight: 400;
  font-size: 0.9em;
  text-rendering: optimizeLegibility;
  line-height: 1.65rem;
  margin: 0;
`

const Footer = () => (
  <FooterWrapper>
    <CopyRight>&copy; 2017 Thomas Maximnini</CopyRight>
  </FooterWrapper>
)

export default Footer
