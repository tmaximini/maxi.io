import React from "react";
import styled from "styled-components";

import { FaTwitter, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const FooterWrapper = styled.footer`
  color: rgba(0, 0, 0, 0.7);
  padding: 40px;
`;

const CopyRight = styled.h4`
  color: rgba(0, 0, 0, 0.7);
  text-align: center;
  font-weight: 400;
  font-size: 0.9em;
  text-rendering: optimizeLegibility;
  line-height: 1.65rem;
  margin: 0;
`;

const SocialMedia = styled.div`
  display: flex;
  margin: 10px auto;
  text-align: center;
  align-items: center;
  justify-content: center;
  a {
    padding: 0 5px;
  }
`;

const Footer = () => (
  <FooterWrapper>
    <CopyRight>&copy; {new Date().getYear() + 1900} Thomas Maximini</CopyRight>
    <SocialMedia>
      <a
        href="http://github.com/tmaximini"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub size={22} />
      </a>
      <a
        href="http://twitter.com/tmaximini"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter size={22} />
      </a>
      <a
        href="https://www.linkedin.com/in/thomas-maximini-98701982/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin size={22} />
      </a>
      <a
        href="http://instagram.com/mxmn82"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaInstagram size={22} />
      </a>
    </SocialMedia>
  </FooterWrapper>
);

export default Footer;
