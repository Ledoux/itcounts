import React, { PropTypes } from 'react'

import Link from './Link'

// prevent creating new function every time default prop onClick is required
const noop = () => {}

const Button = ({children,
  className,
  disabled,
  download,
  external,
  href,
  onClick,
  target,
  forceAnchorElement,
  type }) => {
  const classes = className || 'button'
  if (href) {
    return (
      <Link
        external={external}
        href={href}
        target={target}
        forceAnchorElement={forceAnchorElement}
        className={classes}
        download={download}
      >{children}</Link>
    )
  }
  return (
    <button
      disabled={disabled}
      download={download}
      type={type}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  href: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  target: PropTypes.string,
  type: PropTypes.string
}

Button.defaultProps = {
  onClick: noop
}

export default Button
