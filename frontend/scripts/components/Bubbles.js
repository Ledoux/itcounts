import { max } from 'd3-array'
import {
  forceManyBody,
  forceSimulation,
  forceX,
  forceY
} from 'd3-force'
import { scaleSqrt } from 'd3-scale'
import { select } from 'd3-selection'
import React, {Component, PropTypes} from 'react'

import { getAsyncData } from '../utils/apis'
import { fraction } from '../utils/math'

const options = [
  {
    text: 'Par région',
    value: 'region'
  },
  {
    text: 'Par groupe politique',
    value: 'parti_politique'
  },
  {
    text: 'Par tranche d\'âge',
    value: 'age'
  }
]

// https://medium.com/walmartlabs/d3v4-forcesimulation-with-react-8b1d84364721#.omxozt9ho
export default class Bubbles extends Component {
  constructor () {
    super()
    this.state = { nodes: [] }
    this.updateBubbles = this._updateBubbles.bind(this)
    this.onChangeSelect = this._onChangeSelect.bind(this)
  }
  componentDidMount () {
    // fill with the default first option
    this.updateBubbles(options[0].value)
  }
  /*
  componentWillMount() {
    force.on('tick', () => {
      // after force calculation starts, call
      // forceUpdate on the React component on each tick
      this.forceUpdate()
    })
  },
  */
  /*
  componentWillReceiveProps(nextProps) {
    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
    force.nodes(nextProps.nodes).links(nextProps.links)
    force.start()
  },
  */
  componentDidUpdate () {
    // unpack
    const { forceStrength, height, width } = this
    const { nodes } = this.state
    // update force
    this.force = forceSimulation(nodes)
     .force('charge',
       forceManyBody()
         .strength(forceStrength)
     )
     .force('x', forceX(width / 2))
     .force('y', forceY(height / 2))
    // select
    const node = select('.g-nodes')
      .selectAll('.g-node')
    const nodeData = node.data(nodes, d => d.name)
    nodeData.exit().remove()
    // generic
    const nodeEnter = nodeData.enter()
      .append('a')
      .attr('class', 'g-node')
      .call(this.force.drag)
      // .call(linkTopic)
    // femme
    const femmeEnter = nodeEnter.append('g')
      .attr('class', 'g-femme')
    femmeEnter.append('clipPath')
      .attr('id', d => 'g-clip-femme-' + d.id)
      .append('rect')
    femmeEnter.append('circle')
    // homme
    const hommeEnter = nodeEnter.append('g')
      .attr('class', 'g-homme')
    hommeEnter.append('clipPath')
      .attr('id', d => 'g-clip-homme-' + d.id)
      .append('rect');
    hommeEnter.append('circle')
    nodeEnter.append('line')
      .attr('class', 'g-split')
    // all
    nodeData.selectAll('rect')
      .attr('y', d => -d.r - clipPadding)
      .attr('height', d => 2 * d.r + 2 * clipPadding)
    // rect
    nodeData.select('.g-femme rect')
      .style('display', d => d.k > 0 ? null : 'none')
      .attr('x', d => -d.r - clipPadding)
      .attr('width', d => 2 * d.r * d.k + clipPadding)
    nodeData.select('.g-homme rect')
      .style('display', d => d.k < 1 ? null : 'none')
      .attr('x', d => -d.r + 2 * d.r * d.k)
      .attr('width', d => 2 * d.r)
    // circle
    nodeData.select('.g-femme circle')
      .attr('clip-path', d => d.k < 1 ? 'url(#g-clip-femme-' + d.id + ')' : null)
    nodeData.select('.g-homme circle')
      .attr('clip-path', d => d.k > 0 ? 'url(#g-clip-homme-' + d.id + ')' : null)
    // split
    nodeData.select('.g-split')
      .attr('x1', d => -d.r + 2 * d.r * d.k)
      .attr('y1', d => -Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)))
      .attr('x2', d => -d.r + 2 * d.r * d.k)
      .attr('y2', d => Math.sqrt(d.r * d.r - Math.pow(-d.r + 2 * d.r * d.k, 2)))
    // all circles
    nodeData.selectAll('circle')
      .attr('r', d => this.getRadius(d.count))
  }
  _onChangeSelect (event) {
    this.updateBubbles(event.target.value)
  }
  async _updateBubbles (request) {
    // unpack
    const { width } = this.props
    // get the data from the api
    const data = await getAsyncData(request)
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
    const collisionPadding = 4
    const clipPadding = 4
    const minRadius = 40 // minimum collision radius
    const maxRadius = 70 // also determines collision search radius
    let activeTopic = null // currently-displayed topic
    this.getRadius = scaleSqrt()
      .domain([0, max(nodes, d => d.count)])
      .range([0, maxRadius])
    nodes.forEach(node => {
      node.r = this.getRadius(node.count)
      node.cr = Math.max(minRadius, node.r)
      node.k = fraction(node.F, node.H)
      if (isNaN(node.k)) node.k = .5
      node.cx = node.x =( 1- node.k) * width + Math.random()
      node.cy = node.y = node.H
      node.bias = .3 - Math.max(.1, Math.min(.9, node.k))
    })
    // update the component
    this.setState({ nodes })
  }
  componentWillUnmount() {
    this.force.stop()
  }
  render () {
    const { height, width } = this
    const { nodes } = this.state
    console.log('nodes', nodes)
    return (
      <div>
        <div>
          <select
            ref={e => { this._selectElement = e }}
            onChange={this.onChangeSelect}
          >
            {
              options.map(({text, value}, index) => (
                <option
                  key={index}
                  value={value}
                >
                  {text}
                </option>
              ))
            }
          </select>
        </div>
        <svg
          ref={e => { this._svgElement = e }}
          height={height}
          width={width}
        >
          {
            nodes.map((node, index) =>(
              <circle
                r={node.r}
                cx={node.x}
                cy={node.y}
                fill='red'
                key={index}
              />
            ))}
        </svg>
      </div>
    )
  }
}

Bubbles.defaultProps = {
  forceStrength: -10,
  height: 300,
  width: 300
};
