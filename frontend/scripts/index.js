import 'babel-polyfill'
// required just for webpack bundling
require('../styles/index.scss')
// required for polyfilling for older browsers.. should not be needed though?
require('whatwg-fetch')

import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import Root from './containers/Root'
import rootReducer from './reducers'
import rootSaga from './sagas'

function domReady () {
  return new Promise(function (resolve) {
    var state = document.readyState
    if (state === 'complete' ||
      state === 'loaded' ||
      // can fire too early in IE, before the whole html is parsed...
      (state === 'interactive' && !!window.__INITIAL_STATE__)) {
      return resolve()
    }
    document.addEventListener('DOMContentLoaded', function () {
      resolve()
    })
  })
}

const sagaMiddleware = createSagaMiddleware()

domReady().then(() => {
  const hydratedState = window.__INITIAL_STATE__
  let storeEnhancer
  if (window.devToolsExtension) {
    storeEnhancer = compose(
      applyMiddleware(sagaMiddleware),
      window.devToolsExtension()
    )
  } else {
    storeEnhancer = compose(
      applyMiddleware(sagaMiddleware)
    )
  }
  const store = createStore(
    rootReducer,
    hydratedState,
    storeEnhancer
  )
  sagaMiddleware.run(rootSaga)
  // actual render app
  const reactDivElement = document.getElementById('app_div')
  if (!reactDivElement) {
    return
  }
  if (!module.hot) {
    // production
    ReactDOM.render(<Root store={store} />, reactDivElement)
  } else {
    // dev
    const AppContainer = require('react-hot-loader').AppContainer
    ReactDOM.render(<AppContainer>
      <Root store={store} />
    </AppContainer>, reactDivElement)
    module.hot.accept('./containers/Root', () => {
      const NextRoot = require('./containers/Root').default
      ReactDOM.render(
        <AppContainer>
          <NextRoot store={store} />
        </AppContainer>,
        reactDivElement
      )
    })
  }
})
