import React, { Component } from 'react'
import '../styles/LineChart.css'
import { scaleLinear, scaleTime } from 'd3-scale'
import { axisRight, axisBottom, axisTop, axisLeft } from 'd3-axis'
import { max, extent } from 'd3-array'
import { timeDay, timeWeek, timeMonth } from 'd3-time'
import { timeParse, timeFormat } from 'd3-time-format'
import { line } from 'd3-shape'
import { select } from 'd3-selection'

class LineChart extends Component {
  constructor(props){
    super(props)
    this.createLineChart = this.createLineChart.bind(this)
 }

 componentDidMount() {
    this.createLineChart()
 }

 componentDidUpdate() {
    this.createLineChart()
 }

 createLineChart() {
    const { GRAPHIC, timeScale } = this.props
    const node = this.node,
          svg = select(node),
          margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom,
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const xScale = scaleTime().rangeRound([0, width])
    const yScale = scaleLinear().rangeRound([height, 0])
    const datePrice = GRAPHIC

    xScale.domain(extent(datePrice, d => d.date))
    yScale.domain(extent(datePrice, d => d.price))

    g.append('g')
      .attr('transform', 'translate(0, ' + height + ')')
      .attr('class', 'axisBottom')
      .call(axisBottom(xScale)
        .ticks(10)
        .tickSize(-height)
      )
      .select('.domain')
      .remove()

    g.append('g')
      .attr('class', 'axisLeft')
      .call(axisLeft(yScale)
        .ticks(10)
        .tickSize(-width)
      )
      .append('text')
      .attr('fill', 'white')
      .attr('transform', 'rotate(0)')
      .attr('y',6)
      .attr('dy','0.71em')
      .attr('text-anchor','end')
      .text('price ($)')

    g.append('path')
      .datum(datePrice)
      .attr('fill', 'none')
      .attr('stroke', '#58B5FD')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width',3)
      .attr('d', line().x(d => xScale(d.date)).y(d => yScale(d.price)))
       // for some reason React did not let me isolate the line() function into its own variable even though the   { line } fn was imported from d3.shape.

}

 render() {
    var svgStyle = {
    // borderRight: '1px black solid',
    // borderBottom: '1px black solid'
      border: '1px black solid'
    }
    return (
      <div className="lineChart">
        <svg ref={node => this.node = node}
          width={960} height={500} style={svgStyle}>
        </svg>
      </div>
    )
  }
}

export default LineChart
