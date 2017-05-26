import createBrowserHistory from 'history/createBrowserHistory'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router,
  Route
} from 'react-router-dom'

import { IS_NODE, BASE_NAME } from '../utils/config'
import { routes } from '../utils/routing'

export const browserHistory = IS_NODE ? undefined : createBrowserHistory({
  basename: BASE_NAME
})

const Root = class Root extends Component {
  componentDidMount () {
    this._unlisten = browserHistory.listen(location => {
      // FROM: https://github.com/reactjs/react-router/issues/2144#issuecomment-150939358
      // Use setTimeout to make sure this runs after React Router's own listener
      setTimeout(() => {
        // Keep default behavior of restoring scroll position when user:
        // - clicked back button
        // - clicked on a link that programmatically calls `history.goBack()`
        // - manually changed the URL in the address bar (here we might want
        // to scroll to top, but we can't differentiate it from the others)
        if (location.action === 'POP') {
          return
        }
        // In all other cases, scroll to top
        window.scrollTo(0, 0)
      })
    })
  }
  componentWillUnmount () {
    if (typeof this._unlisten === 'function') {
      this._unlisten()
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory} >
          <div>
            {
              routes.map((route, index) =>
                <Route key={index} {...route} />
              )
            }
          </div>
        </Router>
      </Provider>
    )
  }
}

export default Root
