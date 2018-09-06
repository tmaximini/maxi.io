import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'
import P from '../Shared/P/P'
import pic from './thomas2.jpg'
import background from './background2.jpg'

const ProfileWrapper = styled.section`
  text-align: center;
  margin-top: 40px;
  min-height: 100%;
  a {
    font-weight: bold;
  }
`

const ProfilePic = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px white, 0 3px 8px 3px #ccc;
  margin: 20px 0;
`

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
`

const Name = styled.h2`
  font-size: 2.5em;
  display: inline-block;
  margin: 0;
  font-weight: 600;
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
    <NameWrapper>
      <h3>Hi, my name is</h3>
      <Name>Thomas Maximini</Name>
      <h3>and I am a freelance web developer</h3>
    </NameWrapper>

    <ProfilePic src={pic} />
    <P>
      My focus is on interactive web and mobile applications based on modern and open web
      technologies.
    </P>
    <P>
      I am based in Berlin, Germany, but I <Link to="/travel">travel</Link> a lot and thus do a lot
      of my work remotely.
    </P>
    <P>
      Here you can check out some of my <Link to="/work">work</Link>.
    </P>
    <P>
      You can also find me on <a href="http://github.com/tmaximini">Github</a>,{' '}
      <a href="http://twitter.com/tmaximini">Twitter</a> or send me an{' '}
      <a href="mailto:tmaximini@gmail.com">E-Mail</a>.
    </P>
  </ProfileWrapper>
)

export default Profile
