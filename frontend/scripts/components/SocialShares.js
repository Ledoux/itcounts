import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Icon from './Icon'

const SocialShares = ({className}) => {
  return (<div className={classnames(className,"social-shares")}>
    <div className="social-shares__facebook col col-6">
      <Icon className="social-shares-icon col col-3" icon="facebook" />
      <p className="social-shares-text"> Partager </p>
    </div>
    <div className="social-shares__facebook col col-6">
      <Icon className="social-shares-icon col col-3" icon="twitter" />
      <p className="social-shares-text"> Partager </p>
    </div>
  </div>)
}

export default SocialShares
