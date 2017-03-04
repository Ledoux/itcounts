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
      OnComponent,
      OffComponent
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
        { isSwitched ? OnComponent : OffComponent}
      </div>
    </button>)
  }
}

Switch.defaultProps = {
  OffComponent: <p> OFF </p>,
  OnComponent: <p> ON </p>
}

export default Switch
