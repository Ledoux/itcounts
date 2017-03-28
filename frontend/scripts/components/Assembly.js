import classnames from 'classnames'
import React, {Component, PropTypes} from 'react'
import ToggleButton from 'react-toggle-button'

import Switch from './Switch'
import options from '../utils/assembly'

class Assembly extends Component {
  constructor () {
    super()
    this.state = { currentOption: options[0], isAll: true }
    this.updateAssembly = this._updateAssembly.bind(this)
    this.handleToggleClick = this._handleToggleClick.bind(this)
    this.handleSelectOption = this._handleSelectOption.bind(this)
  }
  _handleToggleClick () {
    this.setState({ isAll: !this.state.isAll })
  }
  _handleSelectOption (request) {
    let { currentOption } = this.state
    // check that we actually need to update or not
    if (currentOption.value === request) {
      return
    } else {
      this.updateAssembly(request)
    }
  }
  async _updateAssembly (request) {
    // get
    const currentOption = options.filter(option => option.value === request)[0]
    // update the component
    this.setState({ currentOption })
  }
  render () {
    const { handleSelectOption, handleToggleClick } = this
    const { optionsHeight } = this.props
    const { currentOption, isAll } = this.state
    const optionWidth = 100 / options.length
    return (
      <div className='assembly center'>
        <div className='assembly__dropdown'>
          <select
            className='assembly__dropdown__select'
            onChange={(e) => handleSelectOption(e.target.value)}
          >
            {
              options.map(({text, value}, index) => (<option
                className={classnames('assembly__dropdown__select__option', {
                  'assembly__dropdown__select__option--selected': currentOption.value === value
                })}
                key={index}
                value={value}
              >
                  {text}
              </option>))
            }
          </select>
        </div>
        <div className='assembly__slider'>
          <div className='assembly__slider__container flex justify-center'>
            {
              options.map(({text, value}, index) => (<button
                className={classnames('assembly__slider__container__option', {
                  'assembly__slider__container__option--selected': currentOption.value === value
                })}
                key={index}
                onClick={() => handleSelectOption(value)}
              >
                  {text}
              </button>))
            }
          </div>
          <div className='assembly__slider__container__selector'>
            <div className='assembly__slider__container__selector__shift'
              style={{
                left: `${currentOption.index * optionWidth}%`,
                width: `${optionWidth}%`
              }}
            />
          </div>
        </div>
        <div>
          <div className='assembly__content'>
            <div className='assembly__content__legend col lg-col-3'>
              <div className='assembly__content__legend__title'>
                Filtres
                <p className='assembly__content__legend__title__subtitle'>
                  cliquer sur le bouton pour ne voir que
                    les femmes
                </p>
              </div>

              <Switch
                className={classnames('switch assembly__content__legend__switch',
                  {
                    [`switch--${currentOption.value}--on`]: !isAll,
                    [`switch--${currentOption.value}--off`]: isAll
                  }
                )}
                handleToggleClick={handleToggleClick}
                OffElement={<p> Tous </p>}
                OnElement={<p> D&eacute;put&eacute;es </p>}
              />
            <p className='assembly__content__legend__title assembly__content__legend__title--legend'>
                L&eacute;gende
              </p>
              {currentOption.infos}
            </div>
            <div className='assembly__content__viz col lg-col-9'>
              <img
                className='assembly__content__viz__img'
                src={`static/images/${currentOption.image}${isAll ? '' : '_f'}.png`}
              />
            </div>
          </div>
          <div className='assembly__description'>
            {currentOption.description}
          </div>
        </div>
      </div>
    )
  }
}

export default Assembly
