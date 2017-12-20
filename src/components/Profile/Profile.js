import React from 'react'
import styled from 'styled-components'
import P from '../Shared/P/P'
import pic from './profile_pic.png'

const ProfileWrapper = styled.section`
  text-align: center;
  padding: 20px;
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
  color: inherit;
  text-decoration: none;
  padding: 0.25em;
  line-height: 1;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
  background-color: rgba(87, 199, 255, 0.1);
  border-right: 2px solid rgba(87, 199, 255, 0.3);
  border-left: 2px solid rgba(87, 199, 255, 0.3);
`

const Profile = () => (
  <ProfileWrapper>
    <ProfilePic src={pic} />
    <NameWrapper>
      <Name>Thomas Maximini</Name>
    </NameWrapper>
    <Skills>
      <Skill>full stack developer</Skill>
      <Skill>react lover</Skill>
      <Skill>electronic music producer</Skill>
    </Skills>
    <P>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic, iure cupiditate dolor nisi
      atque deleniti ratione pariatur est, similique voluptates delectus placeat omnis beatae? Vitae
      vero laborum distinctio voluptatibus quisquam!
    </P>
  </ProfileWrapper>
)

export default Profile
