import classnames from 'classnames'
import React, {Component, PropTypes} from 'react'
import ToggleButton from 'react-toggle-button'

import Icon from './Icon'
import Switch from './Switch'

const description = `Saviez-vous que les emplacements proches des micros et des caméras,
ou bien le long des allées et en bas de l'Assemblée, vers les
ministres ou les chefs de groupe, étaient particulièrement convoités ?
Ces places donnent plus de chances aux député-e-s qui s'y trouvent d'être filmé-e-s
le jour des questins au gouvernement.

Les femmes ont-elles les mêmes chances que les hommes de s'y trouver ?`

const options = [
  {
    description,
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
    text: 'Meilleurs sieges',
    value: 'meilleurs_sieges',
    image: 'zones'
  },
  {
    description,
    text: 'Groupe politique',
    value: 'groupe_politique',
    image: 'partis'
  },
  {
    description,
    text: 'Commission',
    value: 'commission',
    image: 'commissions'
  },
  {
    description,
    text: 'Mandats cumulés',
    value: 'mandats_cumules',
    image: 'mandats'
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
              <div className='assembly__content__legend__title mb3'>
                Filtres
                <p className='assembly__content__legend__title__subtitle'>
                  cliquer sur le bouton pour ne voir que
                    les femmes
                </p>
              </div>

              <Switch
                className='switch assembly__content__legend__switch'
                handleToggleClick={handleToggleClick}
                OffElement={<p> Tous </p>}
                OnElement={<p> D&eacute;put&eacute;es </p>}
              />
              <p className='assembly__content__legend__title'>
                L&eacute;gende
              </p>
              {currentOption.infos}
            </div>
            <div className='assembly__content__viz col md-col-8'>
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
