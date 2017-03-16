import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'

import Header from '../components/Header'

const App = class App extends Component {
  render () {
    const {children} = this.props

    return (
      <div className='app'>
        {/*
          NOTE: Helmet lib content goes into <head> tags
          for twitter card validation go there
          https://cards-dev.twitter.com/validator
        */}
        <Helmet
          title='Parité au Pouvoir'
          meta={[
            { property: 'og:site_name', content: 'Parité au Pouvoir' },
            { property: 'og:description', content: 'Allez' },
            { property: 'description', content: 'Allez' },
            { property: 'og:title', content: 'Parité au Pouvoir' },
            { property: 'twitter:creator', content: '@_erwanledoux' },
            { property: 'twitter:card', content: 'summary_large_image' },
            { property: 'twitter:site', content: '@DataForGood_FR' },
            { property: 'og:image', content: 'https://pariteaupouvoir.herokuapp.com/static/images/camembert.png' },
            { property: 'og:image:width', content: '2400' },
            { property: 'og:image:height', content: '1260' }
          ]}
        />
        <Header />

        {children}

      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
}

export default App
