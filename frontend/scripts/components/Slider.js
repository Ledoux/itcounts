import classnames from 'classnames'
import React, { Component } from 'react'

const Option = ({}) => (<button onClick>
</button>)

class Slider extends Component {
  constructor () {
    super()
    this.state = { selectedIndex: 0 }
    this.handleOptionClick = this._handleOptionClick.bind(this)
  }
  _handleOptionClick (selectedIndex) {
    this.setState({ selectedIndex })
  }
  render () {
    const { handleOptionClick,
      updateBubbles
    } = this
    const { className,
      OptionComponent,
      options
    } = this.props
    const {
      selectedIndex
    } = this.state
    return (<div className={classnames('slider', className)}>
      {
        options.map(({text, value}, index) => (<button
          key={index}
          onClick={() => {
            handleOptionClick(index)
          }}
        >
            {text}
        </button>))
      }
    </div>)
  }
}

Slider.defaultProps = {
  OptionComponent: React.div
}

export default Slider
