import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Icon from './Icon'

const Logo = ({onTopOfDarkSection}) => {
  const classes = classnames({
    'logo--on-dark-bg': onTopOfDarkSection
  }, 'logo icon')
  return (<div>
    <Icon icon='mini-assembly' className={classes} />
  </div>)
}

Logo.propTypes = {
  onTopOfDarkSection: PropTypes.bool
}

export default Logo
