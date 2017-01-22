import React, {Component, PropTypes} from 'react'

const NAMESPACE = 'http://www.w3.org/1999/xlink'

export default class Icon extends Component {

  componentDidUpdate () {
    // this is needed for Safari, won't redraw the use element otherwise
    if (this._useElement) {
      this._useElement.setAttributeNS(NAMESPACE, 'href', '#' + this.props.icon)
    }
  }

  render () {
    return (
      <svg className={this.props.className || 'icon'}>
        <use ref={e => {
          if (e) {
            this._useElement = e
          }
        }} xlinkHref={'#' + this.props.icon} />
      </svg>
    )
  }
}

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string
}
