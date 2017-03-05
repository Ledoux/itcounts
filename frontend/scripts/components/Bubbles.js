// inspiration from http://www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html#Economy
// https://static01.nyt.com/newsgraphics/2012/09/04/convention-speeches/ac823b240e99920e91945dbec49f35b268c09c38/index.js
import classnames from 'classnames'
import { max } from 'd3-array'
import { drag } from 'd3-drag'
import { format } from 'd3-format'
import {
  forceCenter,
  forceCollide,
  forceManyBody,
  forceSimulation
} from 'd3-force'
import { quadtree } from 'd3-quadtree'
import { scaleSqrt } from 'd3-scale'
import { event, select, selectAll } from 'd3-selection'
import throttle from 'lodash.throttle'
import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'

import Quote from './Quote'
import Slider from './Slider'
import SocialShares from './SocialShares'
import { PROD_URL } from '../utils/secret'
import { getAsyncData } from '../utils/apis'
import { bias, fraction } from '../utils/math'

const options = [
  {
    collideRadius: 30,
    description: `La Nouvelle Aquitaine atteint presque la parité pour ses députés
      alors que l'Ile de France en est loin.`,
    text: 'groupe politique',
    value: 'parti_politique'
  },
  {
    description: `Il y a trois fois plus de députés femmes travaillant dans les “Affaires
      culturelles” que dans la “Finance”.`,
    text: 'commission',
    value: 'commission_permanente'
  },
  {
    description: `Le groupe Républicain comporte beaucoup moins de femmmes (14%)
      que le groupe Socialiste (35%).`,
    text: 'région',
    value: 'region'
  },
  {
    description: `Après 70 ans, la proportion de députés femmes passe en dessous
      de la barre des 15%.`,
    text: 'classe d\'âge',
    value: 'age'
  },
  {
    description: `15% des députés cumulant 4 mandats sont des femmes contre moins
      de 40% pour 1 mandat.`,
    text: 'mandats cumulés',
    value: 'mandat'
  }
]
options.forEach((option, index) => {option.index = index})

// https://medium.com/walmartlabs/d3v4-forcesimulation-with-react-8b1d84364721#.omxozt9ho
class Bubbles extends Component {
  constructor () {
    super()
    this.state = { currentOption: options[0], nodes: [] }
    this.handleSelectOption = this._handleSelectOption.bind(this)
    this.updateBubbles = this._updateBubbles.bind(this)
  }
  componentDidMount () {
    // unpack
    const { updateBubbles } = this
    const {
      centerYCoordinateRatio,
      collideRadius,
      isDrag,
      legendX,
      legendY,
      forceStrength,
      optionsHeight,
      optionWidth,
      selectorHeight,
      vizHeight
    } = this.props
    const {
      currentOption
    } = this.state
    // init svg element
    const vizElement = this.vizElement = document.querySelector('.bubbles__viz__svg')
    const vizWidth = this.vizWidth = vizElement.clientWidth
    const labelsDivElement = document.querySelector('.g-labels')
    const vizSelection = this.vizSelection = select(vizElement)
    const labelsDivSelection = this.labelsSelection = select(labelsDivElement)
    vizSelection.append('rect')
      .attr('class', 'g-overlay')
    // add nodes and labels
    const nodesSelection = this.nodesSelection = vizSelection
      .selectAll('.g-node')
    const labelsSelection = this.labelsSelection = vizSelection
      .selectAll('.g-label')
    // init simulation
    const simulation = this.simulation = forceSimulation()
     .force('charge', forceManyBody().strength(forceStrength))
     .on('tick', () => {
       // unpack
       const { nodesSelection } = this
       // transform
       nodesSelection
        .attr('transform', d => {
          // add border rebound (it is important to keep this.vizWidth because
          // this value may change with resize so we need to get its fresh values
          // stored in the this pointer)
          const translateX = Math.max(d.r, Math.min(this.vizWidth - d.r, d.x))
          const translateY = Math.max(d.r, Math.min(vizHeight - d.r, d.y))
          // return
          return `translate(${translateX},${translateY})`
        })

     })
     .stop()
    // drag
    if (isDrag) {
      vizSelection.call(drag()
        .container(vizElement)
        .subject(() => simulation.find(event.x, event.y))
        .on('start', () => {
          if (!event.active) simulation.alphaTarget(0.3)
            .restart()
          event.subject.fx = event.subject.x
          event.subject.fy = event.subject.y
        })
        .on('drag', () => {
          event.subject.fx = event.x
          event.subject.fy = event.y
        })
        .on('end', () => {
          if (!event.active) simulation.alphaTarget(0)
          event.subject.fx = null
          event.subject.fy = null
        })
      )
    }
    // init mouseover and mouseout on nodes
    const mouseover = (element) => {
      this.nodesSelection.classed('g-hover', p => p === element)
      this.labelsSelection.classed('g-hover', p => p === element)
    }
    const mouseout = (element) => {
      this.nodesSelection.classed('g-hover', false)
      this.labelsSelection.classed('g-hover', false)
    }
    this.linkTopic = (a) => {
      a.on('mouseover', mouseover)
       .on('mouseout', mouseout)
    }

    // add event listener
    this._throttledResize = throttle(() => {
      simulation.stop()
      const vizWidth = this.vizWidth = vizElement.clientWidth
      const centerCoordinates = currentOption.centerCoordinates || [
        vizWidth / 2, vizHeight / centerYCoordinateRatio]
      simulation.force('center', forceCenter(...centerCoordinates))
      simulation.alpha(1)
      simulation.restart()
    }, 100)
    window.addEventListener('resize', this._throttledResize)

    // fill with the default first option
    this.updateBubbles(options[0].value)
  }
  componentDidUpdate (prevProps, prevState) {
    // unpack
    const {
      linkTopic,
      simulation,
      vizSelection
    } = this
    let {
      labelsSelection,
      nodesSelection,
      optionsSelection
    } = this
    const {
      centerYCoordinateRatio,
      clipPadding,
      collideRadius,
      collisionPadding,
      optionsHeight,
      optionWidth,
      vizHeight,
      maxRadius,
      width
    } = this.props
    const {
      currentOption,
      nodes
    } = this.state
    // data
    nodesSelection = nodesSelection
      .data(nodes, d => d.name)
    nodesSelection.exit().remove()
    // we append the data into the selected elements
    // nodes and labels
    // and we split special element given homme/femme features
    this.nodesSelection = nodesSelection = nodesSelection
      .enter()
      .append('a')
      .attr('class', 'g-node')
      .call(this.linkTopic)
    // femme
    const femmeEnter = nodesSelection
      .append('g')
      .attr('class', 'g-femme')
    femmeEnter
      .append('clipPath')
      .attr('id', d => 'g-clip-femme-' + d.id)
      .append('rect')
    femmeEnter
      .append('circle')
    // homme
    const hommeEnter = nodesSelection
      .append('g')
      .attr('class', 'g-homme')
    hommeEnter
      .append('clipPath')
      .attr('id', d => 'g-clip-homme-' + d.id)
      .append('rect');
    hommeEnter
      .append('circle')
    nodesSelection
      .append('line')
      .attr('class', 'g-split')
    // all
    nodesSelection
      .selectAll('rect')
      .attr('y', d => -d.r - clipPadding)
      .attr('height', d => 2 * d.r + 2 * clipPadding)
    // rect
    nodesSelection
      .select('.g-femme rect')
      .style('display', d => d.k > 0 ? null : 'none')
      .attr('x', d => -d.r - clipPadding)
      .attr('width', d => 2 * d.r * d.k + clipPadding)
    nodesSelection
      .select('.g-homme rect')
      .style('display', d => d.k < 1 ? null : 'none')
      .attr('x', d => -d.r + 2 * d.r * d.k)
      .attr('width', d => 2 * d.r)
    // circle
    nodesSelection
      .select('.g-femme circle')
      .attr('clip-path', d => d.k < 1 ? 'url(#g-clip-femme-' + d.id + ')' : null)
    nodesSelection
      .select('.g-homme circle')
      .attr('clip-path', d => d.k > 0 ? 'url(#g-clip-homme-' + d.id + ')' : null)
    // split
    nodesSelection
      .select('.g-split')
      .attr('x1', d => -d.r + 2 * d.r * d.k)
      .attr('y1', d => -Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)))
      .attr('x2', d => -d.r + 2 * d.r * d.k)
      .attr('y2', d => Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)))

    // all circles
    nodesSelection.selectAll('circle')
      .attr('r', d => { d.r = this.getRadius(d.count); return d.r})

    nodesSelection
      .append('foreignObject')
      .attr('width', d => 2 * d.r)
      .attr('height', d => 2 * d.r)
      .attr('transform', d => {
        return 'translate(' + -d.r + ',' + -d.r + ')'
      })
      .append('xhtml:body')
      .style('font', '14px \'Helvetica Neue\'')
      .style('height', '100%')
      .attr('class', 'flex justify-center items-center')
      .append('div')
      .attr('class', 'g-name')
      .text(d => d.name)
    // label
    selectAll('.g-value').style('margin','auto')
    // update simulation
    simulation.nodes(nodes)
    // maybe this set needs a special collide
    simulation.force('collide', forceCollide()
       .radius(d => d.r + (currentOption.collideRadius || collideRadius))
       .iterations(2)
     )
    // center
    const vizWidth = document.querySelector('.bubbles__viz__svg').clientWidth
    const centerCoordinates = currentOption.centerCoordinates || [
      vizWidth / 2, vizHeight / centerYCoordinateRatio]
    simulation.force('center', forceCenter(...centerCoordinates))
    // restart (by also reset the alpha to make the new nodes moving like a new start)
    simulation.alpha(1)
    // restart
    simulation.restart()
  }
  _handleSelectOption (request) {
    let { currentOption } = this.state
    // check that we actually need to update or not
    if (currentOption.value === request) {
      return
    } else {
      this.updateBubbles(request)
    }
  }
  async _updateBubbles (request) {
    // unpack
    const { vizWidth, simulation } = this
    const { maxRadius, minRadius, width } = this.props
    // get
    const currentOption = options.filter(option => option.value === request)[0]
    // get the data from the api
    const data = await getAsyncData(request)
    // stop simulation
    simulation.stop()
    // convert the data into nodes
    const nodesByGroupe = {}
    let id = 0
    data.forEach(({_id : { groupe, sexe }, count}) => {
      if(!(groupe in nodesByGroupe)) {
        nodesByGroupe[groupe] = {}
        ++id
        nodesByGroupe[groupe].id = id
        nodesByGroupe[groupe].name = groupe
        nodesByGroupe[groupe].count = 0
        nodesByGroupe[groupe].F = 0
        nodesByGroupe[groupe].H = 0
      }
      nodesByGroupe[groupe][sexe] += count
      nodesByGroupe[groupe].count += count
    })
    const nodes = Object.keys(nodesByGroupe)
      .map(groupe => nodesByGroupe[groupe])
    let activeTopic = null // currently-displayed topic
    this.getRadius = scaleSqrt()
      .domain([0, max(nodes, d => d.count)])
      .range([0, maxRadius])
    nodes.forEach(node => {
      node.r = this.getRadius(node.count)
      node.cr = Math.max(minRadius, node.r)
      node.k = fraction(node.F, node.H)
      if (isNaN(node.k)) node.k = .5
      node.cx = node.x = (1 - node.k) * vizWidth + Math.random()
      node.cy = node.y = node.H
      node.bias = .3 - Math.max(.1, Math.min(.9, node.k))
    })
    // update the component
    this.setState({ currentOption, nodes })
  }
  componentWillUnmount() {
    this.simulation.stop()
  }
  render () {
    const { handleSelectOption, optionTransition } =  this
    const { optionsHeight, vizHeight, width } = this.props
    const { currentOption } = this.state
    const optionWidth = 100 / options.length
    return (
      <div className='bubbles center'>
        <div className='bubbles__dropdown'>
          <select
            className='bubbles__dropdown__select'
            onChange={(e) =>handleSelectOption(e.target.value)}
          >
            {
              options.map(({text, value}, index) => (<option
                className={classnames('bubbles__dropdown__select__option', {
                  'bubbles__dropdown__select__option--selected': currentOption.value === value
                })}
                key={index}
                value={value}
              >
                  {text}
              </option>))
            }
          </select>
        </div>
        <div className='bubbles__slider'>
          <div className='bubbles__slider__container flex justify-center'>
            {
              options.map(({text, value}, index) => (<button
                className={classnames('bubbles__slider__container__option', {
                  'bubbles__slider__container__option--selected': currentOption.value === value
                })}
                key={index}
                onClick={() => handleSelectOption(value)}
              >
                  {text}
              </button>))
            }
          </div>
          <div className='bubbles__slider__container__selector'>
            <div className='bubbles__slider__container__selector__shift'
              style={{
                left: `${currentOption.index * optionWidth}%`,
                width: `${optionWidth}%`
              }}
            />
          </div>
        </div>
        <div className='bubbles__legend'>
          <div className='bubbles__legend__row col col-6'>
            <p className='bubbles__legend__row__circle bubbles__legend__row__circle--women col col-2'/>
            <p className='bubbles__legend__row__text col col-10'> femmes </p>
          </div>
          <div className='bubbles__legend__row col col-6'>
            <p className='bubbles__legend__row__circle bubbles__legend__row__circle--men col col-2' />
            <p className='bubbles__legend__row__text col col-10'> hommes </p>
          </div>
        </div>
        <div className='bubbles__viz'>
          <svg
            className='bubbles__viz__svg'
            height={vizHeight}
            width={width}
          />
        </div>
        <div>
          <Quote className='quote bubbles__quote'>
            <p className="bubbles__quote__text p2">
              {currentOption.description}
            </p>
          </Quote>
          <SocialShares
            className='social-shares bubbles__social-shares'
            description={currentOption.description}
            imageUrl={`${PROD_URL}/static/images/bubbles_${currentOption.value}.png`}
            title={`Découvrez la proportion de femmes à l'Assemblée Nationale selon leur ${currentOption.text}`}
          />
        </div>
      </div>
    )
  }
}

Bubbles.defaultProps = {
  centerYCoordinateRatio: 2.2,
  collideRadius: 5,
  collisionPadding: 4,
  clipPadding: 4,
  isDrag: true,
  legendY: 30,
  legendX: 20,
  forceStrength: 100,
  selectorHeight: 10,
  optionsHeight: 75,
  vizHeight: 500,
  minRadius: 40, // minimum collision radius
  maxRadius: 70 // also determines collision search radius
}

const mapStateToProps = function ({ browser }) {
  return {
    // isDrag: !browser.lessThan.md,
  }
}

export default connect(mapStateToProps)(Bubbles)
