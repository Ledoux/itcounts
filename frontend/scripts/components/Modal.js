import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { closeModal } from '../reducers/modal'

const Modal = class Modal extends Component {
  render () {
    const { isActive, content, closeModal } = this.props
    const classes = classnames({
      'modal--active': isActive
    }, 'modal')
    return (
      <div className={classes} role='dialog' onClick={closeModal}>
        <div className='modal__dialog' role='document' onClick={e => {
          e.nativeEvent.stopImmediatePropagation() // Prevent click bubbling and closing modal
          e.stopPropagation()
        }}>
          <button
            type='button'
            className='button button--plain modal__close'
            onClick={closeModal}
          >
            ✕
          </button>
          <div className='modal__content'>
            {content}
          </div>
        </div>
      </div>
    )
  }
}

Modal.PropTypes = {
  isActive: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  content: PropTypes.node
}

const mapStateToProps = ({modal: { isActive, content }}) => {
  return { isActive, content }
}

export default connect(mapStateToProps, { closeModal })(Modal)
