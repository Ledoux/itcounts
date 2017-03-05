import classnames from 'classnames'
import React, { Component } from 'react'

class Switch extends Component {
  constructor () {
    super()
    this.state = { isSwitched: false }
    this.handleSwitchClick = this._handleSwitchClick.bind(this)
  }
  _handleSwitchClick () {
    this.setState({ isSwitched: !this.state.isSwitched})
  }
  render () {
    const {
      handleSwitchClick
    } = this
    const { className,
      OnElement,
      OffElement
    } = this.props
    const {
      isSwitched
    } = this.state
    return (<button
      className={classnames(className, 'switch', {
        'switch--off': !isSwitched,
        'switch--on': isSwitched
      })}
      onClick={handleSwitchClick}
    >
      <div>
        { isSwitched ? OnElement : OffElement}
      </div>
    </button>)
  }
}

Switch.defaultProps = {
  OffElement: <p> OFF </p>,
  OnElement: <p> ON </p>
}

export default Switch
