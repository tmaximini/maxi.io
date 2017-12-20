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
      title="Thomas Maximini"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' }
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
