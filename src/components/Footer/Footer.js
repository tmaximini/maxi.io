import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

import Twitter from 'react-icons/lib/fa/twitter'
import Github from 'react-icons/lib/fa/github'
import Instagram from 'react-icons/lib/fa/instagram'
import Tumblr from 'react-icons/lib/fa/tumblr'
import LinkedIn from 'react-icons/lib/fa/linkedin'

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

const SocialMedia = styled.div`
  display: flex;
  margin: 10px auto;
  text-align: center;
  align-items: center;
  justify-content: center;
  a {
    padding: 0 3px;
  }
`

const Footer = () => (
  <FooterWrapper>
    <CopyRight>&copy; {new Date().getYear() + 1900} Thomas Maximnini</CopyRight>
    <SocialMedia>
      <a href="http://twitter.com/tmaximini" target="_blank">
        <Twitter />
      </a>
      <a href="http://github.com/tmaximini" target="_blank">
        <Github />
      </a>
      <a href="https://www.linkedin.com/in/thomas-maximini-98701982/" target="_blank">
        <LinkedIn />
      </a>
      <a href="http://instagram.com/mxmn82" target="_blank">
        <Instagram />
      </a>
      <a href="https://diechaostruppe.tumblr.com/" target="_blank">
        <Tumblr />
      </a>
    </SocialMedia>
  </FooterWrapper>
)

export default Footer
