// inspiration from http://www.nytimes.com/interactive/2012/09/06/us/politics/convention-word-counts.html#Economy
// https://static01.nyt.com/newsgraphics/2012/09/04/convention-speeches/ac823b240e99920e91945dbec49f35b268c09c38/index.js
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
import { transition } from 'd3-transition'
import React, {Component, PropTypes} from 'react'

import Quote from './Quote'
import SocialShares from './SocialShares'
import { getAsyncData } from '../utils/apis'
import { HTAGS } from '../utils/constants'
import { bias, fraction } from '../utils/math'

const options = [
  {
    content: `Morbi convallis justo in rhoncus eleifend. Duis pharetra,
      nulla et placerat laoreet, lectus quam sagittis elit, at blandit ligula lorem sit amet turpis`,
    text: 'Par région',
    value: 'region'
  },
  {
    content: `Sed quis vehicula nisi, eget feugiat sapien. Nullam egestas
      eleifend neque vel vehicula. Suspendisse eu luctus ex. Nam dictum fermentum accumsan.`,
    text: 'Par groupe politique',
    value: 'parti_politique'
  },
  {
    content: `Le groupe Républicain comporte beaucoup moins de femmmes (14%)
      que le groupe Socialiste (35%) ${HTAGS}'`,
    text: 'Par tranche d\'âge',
    value: 'age'
  },
  {
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Etiam elit elit, vestibulum sit amet scelerisque vel, semper at orci`,
    text: 'Par commission',
    value: 'commission_permanente'
  },
  {
    text: 'Par mandat',
    value: 'mandat'
  },
]

// https://medium.com/walmartlabs/d3v4-forcesimulation-with-react-8b1d84364721#.omxozt9ho
export default class Bubbles extends Component {
  constructor () {
    super()
    this.state = { currentOption: options[0], nodes: [] }
    this.updateBubbles = this._updateBubbles.bind(this)
  }
  componentDidMount () {
    // unpack
    const { updateBubbles } = this
    const { forceStrength,
      optionsHeight,
      selectorHeight,
      selectorTransitionTime,
      vizHeight,
      width
    } = this.props
    // init svg element
    const optionsElement = document.querySelector('.bubbles__options__svg')
    const optionsSelection = this.optionsSelection = select(optionsElement)
    const selectorSelection = this.selectorSelection = select(optionsElement)
    const vizElement = document.querySelector('.bubbles__viz__svg')
    const vizElementClientRect = vizElement.getBoundingClientRect()
    const vizElementLeft = vizElementClientRect.left
    const vizElementTop = vizElementClientRect.top
    const labelsDivElement = document.querySelector('.g-labels')
    const vizSelection = this.vizSelection = select(vizElement)
    const labelsDivSelection = this.labelsSelection = select(labelsDivElement)
    vizSelection.append('rect')
      .attr('class', 'g-overlay')
      .attr('width', width)
      .attr('height', vizHeight)
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

        // update bubbles
        updateBubbles(d.value)
      })
      .text(d => d.text)
    // append the selector
    this.selectorSelection = optionsSelection
      .append('rect')
      .attr('class','g-option__body__selector')
      .attr('y', optionsHeight - selectorHeight)
      .attr('height', selectorHeight)
      .attr('width', optionWidth)

    const nodesSelection = this.nodesSelection = vizSelection
      .selectAll('.g-node')
    const labelsSelection = this.labelsSelection = vizSelection
      .selectAll('.g-label')
    // init simulation
    const simulation = this.simulation = forceSimulation()
     .force('charge', forceManyBody().strength(forceStrength))
     .force('center', forceCenter(width / 2, vizHeight / 2))
     .force('collide', forceCollide()
                        .radius(d => d.r + 0.5)
                        .iterations(2)
                      )
     .on('tick', () => {
       // unpack
       const { collide, nodesSelection } = this
       // transform
       nodesSelection
        .attr('transform', d => {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
     })
     .stop()
    // drag
    vizSelection.call(drag()
      .container(vizElement)
      .subject(() => simulation.find(event.x, event.y))
      .on('start', () => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
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
    // fill with the default first option
    this.updateBubbles(options[0].value)
  }
  componentDidUpdate () {
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
      clipPadding,
      collisionPadding,
      optionsHeight,
      vizHeight,
      maxRadius,
      width
    } = this.props
    const { nodes } = this.state
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
    simulation.restart()
  }
  async _updateBubbles (request) {
    // unpack
    const { simulation } = this
    const { maxRadius, minRadius, width } = this.props
    // get
    const currentOption = options.filter(option => option.value === request)[0]
    // check if an option element exists already
    if (typeof this.optionElement !== 'undefined') {
      this.optionElement.classList.remove('g-option__body--selected')
    }
    this.optionElement = document.querySelector(`.g-option__body-${request}`)
    this.optionElement.classList.add('g-option__body--selected')

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
      node.cx = node.x =(1 - node.k) * width + Math.random()
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
    const { optionsHeight, vizHeight, width } = this.props
    const { currentOption, odes } = this.state
    return (
      <div className='bubbles center'>
        <div className='bubbles__options mb2'>
          <svg
            className='bubbles__options__svg'
            height={optionsHeight}
            width={width}
          />
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
              {currentOption.content}
            </p>
          </Quote>
          <SocialShares className='social-shares bubbles__social-shares' />
        </div>
      </div>
    )
  }
}

Bubbles.defaultProps = {
  collisionPadding: 4,
  clipPadding: 4,
  forceStrength: 100,
  selectorHeight: 10,
  optionsHeight: 75,
  vizHeight: 500,
  minRadius: 40, // minimum collision radius
  maxRadius: 70, // also determines collision search radius
  selectorTransitionTime: 700,
  width: 1000
};
