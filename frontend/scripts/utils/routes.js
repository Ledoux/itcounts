import App from '../containers/App'

import { links } from './constants'

const routes = {
  component: App,
  childRoutes: links
}

export default routes
