import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import P from '../Shared/P/P';
import pic from './icke.png';

const ProfileWrapper = styled.section`
  text-align: center;
  margin-top: 40px;
  min-height: 100%;
  padding: 10px 0;
  a {
    font-weight: bold;
  }
`;

const ProfilePic = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px white, 0 3px 8px 3px #ccc;
  margin: 20px 0;
`;

const NameWrapper = styled.div`
  margin-bottom: 20px;
  font-family: 'Alike', serif;
  h3 {
    margin: 10px auto;
    font-size: 1.1em;
    font-weight: 500;
  }
  h2,
  h3 {
    font-family: inherit;
  }
`;

const Name = styled.h2`
  font-size: 2.5em;
  display: inline-block;
  margin: 0;
  font-weight: 600;
`;

const Profile = () => (
  <ProfileWrapper>
    <h3>Hi, I'm Thomas 👋</h3>

    <P>
      A software engineer and and product manager living in Germany.
      <br />
      Currently I am working with the good folks over at{' '}
      <a href="https://www.crowdcast.io/" alt="Crowdcast.io">
        CrowdCast
      </a>
      .
    </P>
    <ProfilePic src={pic} />
    <P>
      I design and implement systems and services around web and cloud
      technologies. <br /> You can find out more about what I use{' '}
      <a href="/uses">here</a>.
    </P>
    <P>
      You can check out my <Link to="/blog">blog</Link>, or find me
      online on <a href="http://github.com/tmaximini">Github</a> and{' '}
      <a href="http://twitter.com/tmaximini">Twitter</a>.
    </P>
  </ProfileWrapper>
);

export default Profile;
