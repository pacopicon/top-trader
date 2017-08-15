import React, { Component } from 'react'
import '../styles/LineChart.css'
import { scaleLinear, scaleTime } from 'd3-scale'
import { axisRight, axisBottom, axisTop, axisLeft } from 'd3-axis'
import { max, extent } from 'd3-array'
import { timeDay, timeWeek, timeMonth } from 'd3-time'
import { timeParse } from 'd3-time-format'
import { line } from 'd3-shape'
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
    const { data } = this.props
    const node = this.node,
          svg = select(node),
          margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom,
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    const parseTime = timeParse('%Y-%m-%d')

    const xScale = scaleTime().rangeRound([0, width])
    const yScale = scaleLinear().rangeRound([height, 0])

    // const line = line().xScale(d => xScale(d.date)).yScale(d => yScale(d.close))

    this.exposePrices = function(obj) {
      var result = [];
      for (var prop in obj) {
          var value = obj[prop];
          if (typeof value === 'object') {
              result.push(this.exposePrices(value)); // <- recursive call
          }
          else {
              result.push(value);
          }
      }
      return result;
    }

    var dates = data['Time Series (Daily)']
    var dateArray = Object.keys(dates)
    var priceArray = this.exposePrices(dates)

    var closeArray = []

    this.parseData = function(dateArray, priceArray, mainIndex) {

      const dyad = {
        date: parseTime(dateArray[mainIndex]),
        price: Number(priceArray[mainIndex][3])
      }
      closeArray.push(dyad)
      return closeArray
    }

    for (var i=0; i<dateArray.length; i++) {
      this.parseData(dateArray, priceArray, i, 1)
    }
    console.log('closeArray = ', closeArray);

    xScale.domain(extent(closeArray, d => d.date))
    yScale.domain(extent(closeArray, d => d.price))

    g.append('g')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(axisBottom(xScale))
      .select('.domain')
      .remove()

    g.append('g')
      .call(axisLeft(yScale))
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y',6)
      .attr('dy','0.71em')
      .attr('text-anchor','end')
      .text('price ($)')

    g.append('path')
      .datum(closeArray)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width',1.5)
      .attr('d', line().x(d => xScale(d.date)).y(d => yScale(d.price)))
      // .attr('d',line)

      // console.log(line().x(d => xScale(d.date)).y(d => yScale(d.close)));
   }

render() {
  var svgStyle = {
    // borderRight: '1px black solid',
    // borderBottom: '1px black solid'
    border: '1px black solid'
  }
  return <svg ref={node => this.node = node}
    width={960} height={500} style={svgStyle}>
    </svg>
  }
}
export default LineChart
