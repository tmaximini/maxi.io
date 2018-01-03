import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

const HeaderWrapper = styled.header`
  height: 60px;
  width: 100%;
  background-color: #fdfffc;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  border-bottom: 1px solid #f2f2f2;
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
      </nav>
    </Inner>
  </HeaderWrapper>
)

export default Header
