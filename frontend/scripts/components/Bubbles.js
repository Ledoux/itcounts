// inspiration from http://www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html#Economy
// https://static01.nyt.com/newsgraphics/2012/09/04/convention-speeches/ac823b240e99920e91945dbec49f35b268c09c38/index.js
import classnames from 'classnames'
import { max } from 'd3-array'
import { drag } from 'd3-drag'
import { format } from 'd3-format'
import {
  forceX,
  forceY,
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
import { PROD_URL } from '../utils/foos'
import { getAsyncData } from '../utils/apis'
import options from '../utils/bubbles'
import { bias, fraction } from '../utils/math'

// small tweaking function here because the name
// in the db are sometimes not so well relevant
// compared to what expect a naive client :) :).
function getGoodName (name) {
  if (name === 'Socialiste, écologiste et républicain') {
    return 'Les socialistes'
  }
  return name
}

// SPECIAL EXCEPTION FOR FIREFOX SVG that
// have always clientWidth equal to zero for svg
function getClientWidth (element) {
  return element.clientWidth === 0
  ? (element.parentElement && element.parentElement.clientWidth) || 0
  : element.clientWidth
}

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
      chargeStrength,
      gravityStrength,
      isLessThanMd,
      isXBorder,
      isYBorder,
      optionsHeight,
      optionWidth,
      ratioLessThanMdVizHeight,
      selectorHeight,
      vizHeight
    } = this.props
    const {
      currentOption
    } = this.state
    const adaptedVizHeight = isLessThanMd
    ? ratioLessThanMdVizHeight * vizHeight
    : vizHeight
    // init svg element
    const vizElement = this.vizElement = document.querySelector('.bubbles__viz__svg')
    const vizWidth = getClientWidth(vizElement)
    const labelsDivElement = document.querySelector('.g-labels')
    const vizSelection = this.vizSelection = select(vizElement)
    vizSelection.append('rect')
      .attr('class', 'g-overlay')
    // add nodes
    const nodesSelection = this.nodesSelection = vizSelection
      .selectAll('.g-node')
    // init simulation
    const simulation = this.simulation = forceSimulation()
     .force('charge', forceManyBody().strength(chargeStrength))
     .on('tick', () => {
       // unpack
       const { nodesSelection } = this
       // transform
       nodesSelection
        .attr('transform', d => {
          // add border rebound (it is important to keep this.vizWidth because
          // this value may change with resize so we need to get its fresh values
          // stored in the this pointer)
          const translateX = isXBorder
          ? Math.max(d.r, Math.min(this.vizWidth - d.r, d.x))
          : d.x
          const translateY = isYBorder
          ? Math.max(d.r, Math.min(adaptedVizHeight - d.r, d.y))
          : d.y
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
    const mouseover = (d) => {
      const mouseoveredDiv = document.querySelector(`#info-${d.id}`)
      const percentWomen = parseInt(100*d.F/d.count)
      const percentMen = 100 - percentWomen
      mouseoveredDiv.innerHTML = `${d.F} (${percentWomen}%) femmes,
        \n ${d.H} (${percentMen}%) hommes`
    }
    const mouseout = (d) => {
      const mouseoveredDiv = document.querySelector(`#info-${d.id}`)
      mouseoveredDiv.innerHTML = getGoodName(d.name)
    }
    this.linkTopic = (a) => {
      a.on('mouseover', mouseover)
       .on('mouseout', mouseout)
    }

    // add event listener
    this._throttledResize = throttle(() => {
      simulation.stop()
      const vizWidth = this.vizWidth = getClientWidth(vizElement)
      const centerCoordinates = currentOption.centerCoordinates || [
        vizWidth / 2, adaptedVizHeight / (currentOption.centerYCoordinateRatio
          || centerYCoordinateRatio)]
      simulation.force('x', forceX(centerCoordinates[0])
        .strength(gravityStrength))
      simulation.force('y', forceY(centerCoordinates[1])
        .strength(gravityStrength))
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
      isLessThanMd,
      gravityStrength,
      optionsHeight,
      optionWidth,
      vizHeight,
      maxSmFontSize,
      maxMdFontSize,
      maxSmRadius,
      maxMdRadius,
      minSmFontSize,
      minMdFontSize,
      minRadius,
      ratioLessThanMdVizHeight,
      width
    } = this.props
    const {
      currentOption,
      nodes
    } = this.state
    const adaptedVizHeight = isLessThanMd
    ? ratioLessThanMdVizHeight * vizHeight
    : vizHeight
    const maxRadius = isLessThanMd
    ? (currentOption.maxSmRadius || maxSmRadius)
    : (currentOption.maxMdRadius || maxMdRadius)
    const maxFontSize = isLessThanMd
    ? (currentOption.maxSmFontSize || maxSmFontSize)
    : (currentOption.maxMdFontSize || maxMdFontSize)
    const minFontSize =  isLessThanMd
    ? (currentOption.minSmFontSize || minSmFontSize)
    : (currentOption.minMdFontSize || minMdFontSize)
    // if it is just a change of size just change size and return
    if (prevProps.isLessThanMd !== isLessThanMd) {
      nodesSelection
        .selectAll('foreignObject')
        .style('font-size', d => {
          return `${Math.max(minFontSize, (d.r / maxRadius) * maxFontSize)}px`
        })
        // Do not make the font-weight proportionnal
        // to radius it is too ugly for now
        // .style('font-weight', d => {
        //  return `${(d.r / maxRadius) * 800}`
        // })
      return
    }
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
      .append('rect')
    hommeEnter
      .append('circle')
    nodesSelection
      .append('line')
      .attr('class', 'g-split')

    // SET THE RADIUS GIVEN THE RESPONSIVE STATE
    // all circles
    nodesSelection.selectAll('circle')
      .attr('r', d => {
        d.r = this.getRadius(d.count)
        if (isLessThanMd) {
          d.r = d.r / 2
        } else {
          d.r = d.r / 1.25
        }
        return d.r
    })

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
      .attr('id', d => `info-${d.id}`)
      .attr('class', 'g-name')
      .attr('title', d => getGoodName(d.name))
      .text(d => getGoodName(d.name))
      .style('font-size', d => {
        return `${Math.max(minFontSize, (d.r / maxRadius) * maxFontSize)}px`
      })
      // Do not make the font-weight proportionnal
      // to radius it is too ugly for now
      // .style('font-weight', d => {
      //  return `${(d.r / maxRadius) * 800}`
      // })
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
    const vizElement = document.querySelector('.bubbles__viz__svg')
    // SPECIAL FIREFOX EXCEPTION
    const vizWidth = getClientWidth(vizElement)
    const centerCoordinates = currentOption.centerCoordinates || [
      vizWidth / 2, adaptedVizHeight / (currentOption.centerYCoordinateRatio || centerYCoordinateRatio)]
    simulation.force('x', forceX(centerCoordinates[0])
      .strength(gravityStrength))
    simulation.force('y', forceY(centerCoordinates[1])
      .strength(gravityStrength))
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
    const {
      isLessThanMd,
      maxSmRadius,
      maxMdRadius,
      minRadius
    } = this.props
    const currentOption = options.filter(option => option.value === request)[0]
    const maxRadius = isLessThanMd
    ? (currentOption.maxSmRadius || maxSmRadius)
    : (currentOption.maxMdRadius || maxMdRadius)
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
      .range([0, currentOption.maxRadius || maxRadius])
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
    const {
      optionsHeight,
      isLessThanMd,
      vizHeight,
      ratioLessThanMdVizHeight,
      width
    } = this.props
    const { currentOption } = this.state
    const optionWidth = 100 / options.length
    const adaptedVizHeight = isLessThanMd
    ? ratioLessThanMdVizHeight * vizHeight
    : vizHeight
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
        <div className='bubbles__legend flex'>
          <div className='bubbles__legend__row'>
            <p className='bubbles__legend__row__circle bubbles__legend__row__circle--women col col-2'/>
            <p className='bubbles__legend__row__text col col-8'> Femmes </p>
          </div>
          <div className='flex-auto' />
          <div className='bubbles__legend__row'>
            <p className='bubbles__legend__row__circle bubbles__legend__row__circle--men col col-2' />
            <p className='bubbles__legend__row__text col col-8'> Hommes </p>
          </div>
        </div>
        <div className='bubbles__viz'>
          <svg
            className='bubbles__viz__svg'
            height={adaptedVizHeight}
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
            shareUrl={`${PROD_URL}/static/cards/${currentOption.value}.html`}
            title={`Découvrez la proportion de femmes à l'Assemblée Nationale selon leur ${currentOption.text}`}
          />
        </div>
      </div>
    )
  }
}

Bubbles.defaultProps = {
  // centerYCoordinateRatio: 2.2,
  centerYCoordinateRatio: 2.,
  collideRadius: 5,
  collisionPadding: 4,
  clipPadding: 4,
  isXBorder: false,
  isYBorder: false,
  isDrag: true,
  legendY: 30,
  legendX: 20,
  chargeStrength: 200,
  gravityStrength: 0.1,
  selectorHeight: 10,
  optionsHeight: 75,
  radiusRatio: 1,
  ratioLessThanMdVizHeight: 0.8,
  vizHeight: 400,
  minSmFontSize: 7,
  minMdFontSize: 12,
  minRadius: 40, // minimum collision radius
  maxSmRadius: 70, // also determines collision search radius
  maxMdRadius: 70, // also determines collision search radius
  maxSmFontSize: 15,
  maxMdFontSize: 25
}

const mapStateToProps = function ({ browser }) {
  return {
    isLessThanMd: browser.lessThan.md
  }
}

export default connect(mapStateToProps)(Bubbles)
