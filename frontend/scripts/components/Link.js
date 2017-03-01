import React from 'react'
import assign from 'lodash.assign'

import { Link as ReactRouterLink } from 'react-router'

const Link = (props) => {
  const useAnchor = (props.target && props.target === '_blank') ||
    props.download ||
    props.external ||
    props.forceAnchorElement
  if (props.external) {
    props = assign({}, props)
    delete props.external
  }
  const LinkComponent = useAnchor ? 'a' : ReactRouterLink
  console.log('LinkComponent', LinkComponent, props.href)
  if (!useAnchor) {
    props.to = props.href
  }
  props
  return <LinkComponent
    {...props}
    onClick={e => {
      e.preventDefault()
      window.history.pushState(null, null, props.href)
      if (props.onClick) {
        props.onClick()
      }
    }}
  />
}

export default Link
