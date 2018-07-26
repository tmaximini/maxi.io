import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

const HeaderWrapper = styled.header`
  height: 60px;
  width: 100%;
  z-index: 10;
  @media screen and (min-width: 680px) {
    margin-top: 30px;
  }
`

const Inner = styled.div`
  display: flex;
  height: 60px;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  max-width: 62em;
  margin: 0 auto;
  @media screen and (min-width: 375px) {
    padding: 0 20px;
  }
`

const Logo = styled(Link)`
  color: #050505;
  text-transform: uppercase;
  text-decoration: none;
`

const NavLink = styled(Link)`
  color: #4b4c4b;
  margin-left: 20px;
  font-size: 14px;
  text-decoration: none;
  text-transform: uppercase;
  @media screen and (min-width: 375px) {
    font-size: 16px;
  }
`

NavLink.defaultProps = {
  activeStyle: {
    borderBottom: '2px solid #4b4c4b'
  }
}

const Header = () => (
  <HeaderWrapper>
    <Inner>
      <Logo to="/">Maxi.io</Logo>
      <nav>
        <NavLink to="/" exact>
          Home
        </NavLink>
        <NavLink to="/work" exact>
          Work
        </NavLink>
        <NavLink to="/travel" exact>
          Travel
        </NavLink>
      </nav>
    </Inner>
  </HeaderWrapper>
)

export default Header
