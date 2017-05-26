import React from 'react'
import { Redirect } from 'react-router'

import App from '../containers/App'
import LegalNoticesPage from '../pages/LegalNoticesPage'
import HomePage from '../pages/HomePage'

export const routes = [
  {
    exact: true,
    label: 'Home',
    path: '/',
    render: () => (<App>
      <HomePage />
    </App>)
  },
  {
    exact: true,
    path: '/legal-notices',
    render: () => (<App>
      <LegalNoticesPage />
    </App>)
  }
]
