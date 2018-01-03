import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import P from '../Shared/P/P'
import pic from './thomas.jpg'

const ProfileWrapper = styled.section`
  text-align: center;
  margin-top: 40px;
`

const ProfilePic = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px white, 0 3px 8px 3px #ccc;
`

const NameWrapper = styled.div`
  margin-bottom: 20px;
`

const Name = styled.h2`
  font-size: 24px;
  display: inline-block;
  margin: 0;
`

const Skills = styled.ul`
  margin-bottom: 20px;
  list-style: none;
`

const Skill = styled.li`
  display: inline-block;
  white-space: nowrap;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  padding: 0.25em 0.4em;
  line-height: 1;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
  font-size: 0.9em;
  background-color: rgba(83, 103, 75, 0.8);
`

const Profile = () => (
  <ProfileWrapper>
    <ProfilePic src={pic} />
    <NameWrapper>
      <Name>Thomas Maximini</Name>
    </NameWrapper>
    <Skills>
      <Skill>full stack developer</Skill>
      <Skill>software engineer</Skill>
      <Skill>coach &amp; team builder</Skill>
    </Skills>
    <P>I am a freelancing software developer based in Berlin, Germany.</P>
    <P>
      I focus on interactive web and mobile applications based on modern and open web technologies.
    </P>
    <P>
      Go and can check out some of my <Link to="/work">work</Link>.
    </P>
    <P>
      You can find me on <a href="http://github.com/tmaximini">Github</a>,{' '}
      <a href="http://twitter.com/tmaximini">Twitter</a> or send me an{' '}
      <a href="mailto:tmaximini@gmail.com">E-Mail</a>.
    </P>
  </ProfileWrapper>
)

export default Profile
