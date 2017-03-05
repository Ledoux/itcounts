import classnames from 'classnames'
import React, {Component, PropTypes} from 'react'
import ToggleButton from 'react-toggle-button'

import Icon from './Icon'
import Switch from './Switch'

const options = [
  {
    description: `Saviez-vous que les emplacements proches des micros et des caméras,
    ou bien le long des allées et en bas de l'Assemblée, vers les
    ministres ou les chefs de groupe, étaient particulièrement convoités ?
    Ces places donnent plus de chances aux députés qui s'y trouvent d'être filmés
    le jour des questins aux gouvernement. Les femmes ont-elles les mêmes chances
    que les hommes de s'y trouver ?`,
    infos: [{
      icon: 'micro_blue',
      text: 'Micros'
    }, {
      icon: 'dark_green',
      text: 'Sièges de haute "valeur" politique'
    }, {
      icon: 'medium_green',
      text: 'Sièges de moyenne "valeur" politique'
    }, {
      icon: 'light_green',
      text: 'Sièges de faible "valeur" politique'
    }, {
      icon: 'medium_grey',
      text: 'Gouvernement'
    }].map(({icon, text}, index) => {
      return (<div
          className='assembly__content__legend__row'
          key={index}
        >
          <Icon
            className='assembly__content__legend__row__icon col mr2'
            icon={icon}
          />
          <p className='assembly__content__legend__row__text col'>
            {text}
          </p>
      </div>)
    }),
    text: 'meilleurs sieges',
    value: 'meilleurs_sieges'
  },
  {
    description: `Bla Bla Bla`,
    text: 'groupe politique',
    value: 'groupe_politique'
  },
  {
    description: `Bla Bla Bla`,
    text: 'commission',
    value: 'commission'
  },
  {
    description: `Bla Bla Bla`,
    text: 'mandats cumulés',
    value: 'mandats_cumules'
  }
]
options.forEach((option, index) => {option.index = index})

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
          <div className='assembly__content mb2'>
            <div className='assembly__content__legend col md-col-4'>
              <p className='assembly__content__legend__title'>
                Filtres
              </p>
              <Switch
                className='switch assembly__content__legend__switch'
                OffElement={<p> Info </p>}
                OnElement={<p> D&eacute;put&eacute;es </p>}
              />
              <p className='assembly__content__legend__title'>
                L&eacute;gende
              </p>
              {currentOption.infos}
            </div>
            <div className='assembly__content__viz col md-col-7'>
              <img
                className='assembly__content__viz__img'
                src={`static/images/assembly_${currentOption.value}_${isAll ? 'all':'women'}.png`}
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