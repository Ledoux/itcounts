import React from 'react'
import assign from 'lodash.assign'

import { Link as ReactRouterLink } from 'react-router'

const Link = (props) => {
  const useAnchor = (props.target && props.target === '_blank') ||
    props.download ||
    props.external
  if (props.external) {
    props = assign({}, props)
    delete props.external
  }
  const LinkComponent = useAnchor ? 'a' : ReactRouterLink
  return <LinkComponent {...props} to={props.href} />
}

export default Link
