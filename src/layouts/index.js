import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

import Wrapper from '../components/Wrapper/Wrapper'
import Header from '../components/Header/Header'
import Main from '../components/Main/Main'
import Footer from '../components/Footer/Footer'

import '../styles/index.scss'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet
      title="Thomas Maximini: Developer of all things web"
      meta={[
        {
          name: 'description',
          content: 'Thomas Maximini is a freelance web developer based in Berlin, Germany'
        },
        {
          name: 'keywords',
          content: 'web development, software engineering, react.js, javascript, node.js'
        }
      ]}
    />
    <Wrapper>
      <Header />
      <Main>{children()}</Main>
      <Footer />
    </Wrapper>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func
}

export default TemplateWrapper
