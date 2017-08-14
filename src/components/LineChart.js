import React, { Component } from 'react'
import '../styles/LineChart.css'
import { scaleLinear } from 'd3-scale'
import { axisRight, axisBottom, axisTop, axisLeft } from 'd3-axis'
import { max, extent } from 'd3-array'
import { select } from 'd3-selection'

class LineChart extends Component {
  constructor(props){
    super(props)
    this.createLineChart = this.createLineChart.bind(this)
    this.state = {
      scatterData: [
        {date: 5, price: 22000},
        {date: 3, price: 18000},
        {date: 10, price: 88000},
        {date: 0, price: 180000},
        {date: 27, price: 56000},
        {date: 8, price: 74000},
      ]
    }
 }

 componentDidMount() {
    this.createLineChart()
 }

 componentDidUpdate() {
    this.createLineChart()
 }

  createLineChart() {
    const { scatterData } = this.state
    // const
    const node = this.node
    const xExtent = extent(scatterData, (d) => d.price)
    const yExtent = extent(scatterData, (d) => d.date)
    const xScale = scaleLinear().domain(xExtent).range([0,500])
    const yScale = scaleLinear().domain(yExtent).range([0,500])

    select(node)
      .selectAll('circle')
      .data(scatterData)
      .enter()
      .append('circle')
      .attr("r",5).attr("cx", (d) => xScale(d.price))
      .attr("cy", (d) => yScale(d.date))

    const xAxis = axisBottom().scale(xScale)
      .tickSize(-500).ticks(4)
    select(node).append('g').attr('id', 'xAxisG').call(xAxis)

    const yAxis = axisRight().scale(yScale)
      .tickSize(500).ticks(16)
    select(node).append('g').attr('id', 'yAxisG').call(yAxis)

    select(node)
      .selectAll("#xAxisG").attr("transform","translate(0,500)")
      .selectAll("#yAxisG").attr("transform","translate(0,500)")

    select(node)
      .selectAll("path.domain").style("fill", "none").style("stroke", "black")
      .selectAll("line").style("stroke", "black")
   }

render() {
  var svgStyle = {
    // borderRight: '1px black solid',
    // borderBottom: '1px black solid'
    border: '1px black solid'
  }
  return <svg ref={node => this.node = node}
    width={519} height={519} style={svgStyle}>
    </svg>
  }
}
export default LineChart
