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
    this.state = {
      chosenSecurity: 'AAPL'
    }
 }

 componentDidMount() {
    this.createLineChart()
 }

 componentDidUpdate() {
    this.createLineChart()
 }

 createLineChart() {
    const { MSFTdailyData, modifier } = this.props
    const node = this.node,
          svg = select(node),
          margin = {top: 20, right: 20, bottom: 30, left: 50},
          width = +svg.attr('width') - margin.left - margin.right,
          height = +svg.attr('height') - margin.top - margin.bottom,
          g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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


    console.log('MSFTdailyData = ', MSFTdailyData);

    console.log(`modifier = ${modifier}`);
    var dates = modifier == 1 ? MSFTdailyData['Time Series (1min)'] : MSFTdailyData['Time Series (Daily)']
    var timeString = modifier == 1 ? '%Y-%m-%d %H:%M:%S' : '%Y-%m-%d'
    var parseTime = timeParse(timeString)
    var formatTime = timeFormat(timeString)

    if (dates == null || typeof dates === 'undefined') {
      var dateArray = [formatTime(new Date), formatTime(new Date)]
      var priceArray = [['1', '1', '1', '1', '1'],['1', '1', '1', '1', '1']]
      console.log(`First phase (dateArray and priceArray setters) fired: dateArray = ${dateArray},  priceArray = ${priceArray}`)
    } else {
      var dateArray = Object.keys(dates)
      var priceArray = this.exposePrices(dates)
      console.log(`Second phase (dateArray and priceArray setters) fired: dateArray.length = ${dateArray.length},  priceArray.length = ${priceArray.length}`)
      // console.log(`Object.keys(dates) = ${Object.keys(dates)}.`)
      // Object.keys(dates).map((key) => {console.log("key = ", key)})
    }


    var dataScope = modifier == 1 ? dateArray.length : modifier

    // console.log(`modifier = ${modifier}.  formatTime(new Date) = ${formatTime(new Date)}.  dataScope = ${dataScope}.  parseTime(dateArray[0]) = ${parseTime(dateArray[0])}`)
    // console.log(`dateArray = ${dateArray}.  priceArray = ${priceArray}.`)


    var datePrice = []

    this.parseData = function(dateArray, priceArray, mainIndex) {

      const dyad = {
        date: parseTime(dateArray[mainIndex]),
        price: dates == null ? 0 : Number(priceArray[mainIndex][3])
      }
      datePrice.push(dyad)
      return datePrice
    }



    for (var i=0; i<dataScope; i++) {
      this.parseData(dateArray, priceArray, i)
    }
    console.log('datePrice = ', datePrice);

    xScale.domain(extent(datePrice, d => d.date))
    yScale.domain(extent(datePrice, d => d.price))

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
      .datum(datePrice)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-width',1.5)
      .attr('d', line().x(d => xScale(d.date)).y(d => yScale(d.price))) // for some reason React did not let me isolate the line() function into its own variable even though the   { line } fn was imported from d3.shape.
   }

   render() {
      var svgStyle = {
      // borderRight: '1px black solid',
      // borderBottom: '1px black solid'
        border: '1px black solid'
      }
      return (
        <div>
          <svg ref={node => this.node = node}
            width={960} height={500} style={svgStyle}>
          </svg>
        </div>
      )
    }
}

export default LineChart
