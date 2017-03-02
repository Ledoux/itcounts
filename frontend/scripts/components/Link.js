import React from 'react'
import assign from 'lodash.assign'

import { Link as ReactRouterLink } from 'react-router'

const Link = (props) => {
  const useAnchor = (props.target && props.target === '_blank') ||
    props.download ||
    props.external ||
    props.forceAnchorElement
  const linkProps = Object.assign({}, props)
  let isExternal = false
  if (linkProps.external) {
    isExternal = true
    delete linkProps.external
  }
  const LinkComponent = useAnchor ? 'a' : ReactRouterLink
  if (!useAnchor) {
    linkProps.to = linkProps.href
  }
  if (linkProps.onClick) {
    linkProps.onClick = (e) => {
      e.preventDefault()
      if (!isExternal) {
        window.history.pushState(null, null, linkProps.href)
      }
      props.onClick()
    }
  }
  return <LinkComponent {...linkProps} />
}

export default Link
