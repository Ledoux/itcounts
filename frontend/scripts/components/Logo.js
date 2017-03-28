import React, { PropTypes } from 'react'
import classnames from 'classnames'

import Icon from './Icon'

const Logo = ({onTopOfDarkSection}) => {
  return (<div className='logo'>
    <img className='icon logo__img' src='/static/images/mini-assembly.png'/>
  </div>)
}

Logo.propTypes = {
  onTopOfDarkSection: PropTypes.bool
}

export default Logo
