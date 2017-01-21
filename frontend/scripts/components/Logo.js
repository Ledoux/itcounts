import React, { PropTypes } from 'react'
import classnames from 'classnames'

const Logo = ({onTopOfDarkSection}) => {
  const classes = classnames({
    'logo--on-dark-bg': onTopOfDarkSection
  }, 'logo icon')
  return (
    <img src='/static/images/logoitcounts-2.png' className={classes} />
  )
}

Logo.propTypes = {
  onTopOfDarkSection: PropTypes.bool
}

export default Logo
