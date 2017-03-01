import classnames from 'classnames'
import React, { PropTypes } from 'react'

const Quote = ({children, className}) => {
  return (<div className={classnames(className, 'quote')}>
    {children}
  </div>)
}

export default Quote
