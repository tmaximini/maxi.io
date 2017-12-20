import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

const HeaderWrapper = styled.header`
  height: 60px;
  width: 100%;
  background-color: #fafafa;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled(Link)`
  color: #050505;
  text-transform: uppercase;
  text-decoration: none;
`

const NavLink = styled(Link)`
  color: #050505;
  margin-left: 20px;
  font-size: 14px;
  text-decoration: none;
  @media screen and (min-width: 375px) {
    font-size: 16px;
  }
`

NavLink.defaultProps = {
  activeStyle: {
    borderBottom: '2px solid'
  }
}

const Header = () => (
  <HeaderWrapper>
    <Logo to="/">Maxi.io</Logo>
    <nav>
      <NavLink to="/" exact>
        Home
      </NavLink>
      <NavLink to="/work" exact>
        Work
      </NavLink>
      <NavLink to="/blog" exact>
        Blog
      </NavLink>
    </nav>
  </HeaderWrapper>
)

export default Header
