import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'

import Header from '../components/Header'
import Modal from '../components/Modal'

const App = class App extends Component {
  render () {
    const {children} = this.props

    return (
      <div className='app'>
        {/* NOTE: Helmet lib content goes into <head> tags */}
        <Helmet
          title='Erwan Ledoux'
          meta={[
            { property: 'og:site_name', content: 'Parité au Pouvoir' },
            { property: 'twitter:site', content: '@DataForGood_FR' },
            { property: 'twitter:creator', content: '@_erwanledoux' },
            { property: 'og:title', content: 'Parité au Pouvoir' },
            { property: 'og:description', content: '' },
            { property: 'description', content: '' },
            { property: 'twitter:card', content: 'summary_large_image' },
            // { property: 'og:image', content: shareImg },
            { property: 'og:image:width', content: '2400' },
            { property: 'og:image:height', content: '1260' }
          ]}
        />
        <Header />

        {children}

        <Modal />

      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.element.isRequired
}

export default App
