import { event, select, selectAll } from 'd3-selection'
import { transition } from 'd3-transition'
import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
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

// https://medium.com/walmartlabs/d3v4-forcesimulation-with-react-8b1d84364721#.omxozt9ho
class Assembly extends Component {
  constructor () {
    super()
    this.state = { currentOption: options[0], isAll: true }
    this.updateAssembly = this._updateAssembly.bind(this)
    this.handleToggleClick = this._handleToggleClick.bind(this)
  }
  componentDidMount () {
    // unpack
    const { updateAssembly } = this
    const { selectorTransitionTime,
      selectorHeight,
      optionsHeight,
      width
    } = this.props
    // init svg element
    const optionsElement = document.querySelector('.assembly__options__svg')
    const optionsSelection = this.optionsSelection = select(optionsElement)
    const selectorSelection = this.selectorSelection = select(optionsElement)
    // init options, nodes and labels selection
    const optionWidth = width/options.length
    const t = transition().duration(selectorTransitionTime)
    optionsSelection
      .selectAll('.g-options')
      .data(options, d => d.value)
      .enter()
      .append('foreignObject')
      .attr('class', d => 'g-option')
      .attr('x', (d,index) => index * optionWidth)
      .attr('width', optionWidth)
      .append('xhtml:body')
      .attr('class', d => `flex justify-center items-center g-option__body g-option__body-${d.value}`)
      .append('div')
      .attr('class', 'g-option__body__button')
      .attr('value', d => d.value)
      .on('click', (d, index) => {
        // move the slide
        this.selectorSelection
          .transition(t)
          .attr('x', index * optionWidth)
        // update assembly
        updateAssembly(d.value)
      })
      .text(d => d.text)
    // append the selector
    this.selectorSelection = optionsSelection
      .append('rect')
      .attr('class','g-option__body__selector')
      .attr('y', optionsHeight - selectorHeight)
      .attr('height', selectorHeight)
      .attr('width', optionWidth)
    // fill with the default first option
    this.updateAssembly(options[0].value)
  }
  _handleToggleClick () {
    this.setState({ isAll: !this.state.isAll })
  }
  async _updateAssembly (request) {
    // unpack
    const { maxRadius, minRadius, width } = this.props
    // get
    const currentOption = options.filter(option => option.value === request)[0]
    // check if an option element exists already
    if (typeof this.optionElement !== 'undefined') {
      this.optionElement.classList.remove('g-option__body--selected')
    }
    this.optionElement = document.querySelector(`.g-option__body-${request}`)
    this.optionElement.classList.add('g-option__body--selected')
    // update the component
    this.setState({ currentOption })
  }
  render () {
    const { handleToggleClick } = this
    const { optionsHeight, width } = this.props
    const { currentOption, isAll } = this.state
    return (
      <div className='assembly center'>
        <div className='assembly__options mb2'>
          <svg
            className='assembly__options__svg'
            height={optionsHeight}
            width={width}
          />
        </div>
        <div className='assembly__content mb2'>
          <div className='assembly__content__legend col col-4'>
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
          <div className='assembly__content__viz col col-7'>
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
    )
  }
}

Assembly.defaultProps = {
  selectorHeight: 10,
  optionsHeight: 75,
  selectorTransitionTime: 700,
  width: 1000
}

const mapStateToProps = function ({ browser }) {
  return {
    width: browser.lessThan.md ? 300 : 1000
  }
}

export default connect(mapStateToProps)(Assembly)
