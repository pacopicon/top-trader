import React, { Component } from 'react'
// import React, { PureComponent } from 'react'
import '../styles/LineChart.css'
import { scaleLinear, scaleTime } from 'd3-scale'
import { axisRight, axisBottom, axisTop, axisLeft } from 'd3-axis'
import { max, extent } from 'd3-array'
import { timeDay, timeWeek, timeMonth } from 'd3-time'
import { timeParse, timeFormat } from 'd3-time-format'
import { line } from 'd3-shape'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import * as ease from 'd3-ease'
import { easement } from '../helpers'
import { CSSTransitionGroup } from 'react-transition-group'


// http://paulhoughton.github.io/mortgage/
// https://github.com/paulhoughton/mortgage/blob/master/src/components/Chart.js
// https://www.npmjs.com/package/d3
// d3noob's vanilla JS transitional chart: http://bl.ocks.org/d3noob/7030f35b72de721622b8
//
// const easement = ease.easeBounce
const margin = {top: 20, right: 20, bottom: 80, left: 50},
  fullWidth = 960,
  fullHeight = 600,
  width = fullWidth - margin.left - margin.right,
  height = fullHeight - margin.top - margin.bottom

const xScale = scaleTime().rangeRound([0, width])
const yScale = scaleLinear().rangeRound([height, 0])

const lineGenerator = line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.price))


class LineChart extends Component {
  constructor(props){
    super(props)
    this.drawAxis = this.drawAxis.bind(this)
  }

 componentDidMount() {
    const datePrice = this.props.GRAPHIC
    this.actual.transition().duration(1000).ease(easement).attr('d', lineGenerator(datePrice))
    // this.actual.attr('d', lineGenerator(datePrice))
    this.drawAxis()
 }

 componentDidUpdate() {
   const datePrice = this.props.GRAPHIC
   this.actual.transition().duration(1000).ease(easement).attr('d', lineGenerator(datePrice))
  //  this.actual.attr('d', lineGenerator(datePrice))
   this.drawAxis()
 }

 // componentWillUnmount() {
 //   const datePrice = this.props.GRAPHIC
 //   this.actual.transition().duration(1000).ease(easement).attr('d', lineGenerator(datePrice))
 //   this.drawAxis()
 // }
 //
 // componentWillMount() {
 //   setTimeout( () => {
 //     const datePrice = this.props.GRAPHIC
 //     this.actual.transition().duration(1000).ease(easement).attr('d', lineGenerator(datePrice))
 //     this.drawAxis()
 //   }, 1500)
 //
 // }

 // componentWillUpdate(nextProps, nextState) {
 //
 //   const datePrice = this.props.GRAPHIC
 //   xScale.domain(extent(datePrice, d => d.date))
 //   yScale.domain(extent(datePrice, d => d.price))
 //
 //   this.drawAxis()
 //   this.actual.transition().duration(1000).ease(easement).attr('d', lineGenerator(datePrice))
 // }

 // Do not know how to specify the nextProps argument.  Is it an object, or is it a variable?
   // componentWillReceiveProps(nextProps) {
   //   if ((nextProps.GRAPHIC[0].price !== this.props.GRAPHIC[0].price) || (nextProps.GRAPHIC[GRAPHIC.length - 1].date !== this.props.GRAPHIC[GRAPHIC.length - 1].date) || (nextProps.GRAPHIC[GRAPHIC.length - 1].price !== this.priops.GRAPHIC[GRAPHIC.length - 1].price) ) {
   //     const datePrice = nextProps.GRAPHIC
   //     xScale.domain(extent(datePrice, d => d.date))
   //     yScale.domain(extent(datePrice, d => d.price))
   //
   //     this.drawAxis()
   //   }
   //   this.actual.transition().attr('d', lineGenerator(datePrice))
   // }

   // componentWillUpdate(nextProps, nextState) {
   //   if ((nextProps.GRAPHIC[0].price !== this.props.GRAPHIC[0].price) || (nextProps.GRAPHIC[GRAPHIC.length - 1].date !== this.props.GRAPHIC[GRAPHIC.length - 1].date) || (nextProps.GRAPHIC[GRAPHIC.length - 1].price !== this.priops.GRAPHIC[GRAPHIC.length - 1].price) ) {
   //     const datePrice = nextProps.GRAPHIC
   //     xScale.domain(extent(datePrice, d => d.date))
   //     yScale.domain(extent(datePrice, d => d.price))
   //
   //     this.drawAxis()
   //   }
   //   this.actual.transition().attr('d', lineGenerator(datePrice))
   // }

   // componentWillReceiveProps(nextProps) {
   //   const datePrice = nextProps.GRAPHIC
   //   if (nextProps !== this.props) {
   //     xScale.domain(extent(datePrice, d => d.date))
   //     yScale.domain(extent(datePrice, d => d.price))
   //
   //     this.drawAxis()
   //     this.actual.transition().attr('d', lineGenerator(datePrice))
   //   }
   //
   // }

   // shouldComponentUpdate(nextProps, nextState) {
   //
   //   const datePrice = this.props.GRAPHIC
   //   xScale.domain(extent(datePrice, d => d.date))
   //   yScale.domain(extent(datePrice, d => d.price))
   //
   //   this.drawAxis()
   //   this.actual.transition().duration(1000).ease(easement).attr('d', lineGenerator(datePrice))
   //
   //   return false
   // }

drawAxis() {
  // const datePrice = this.props.GRAPHIC
  // xScale.domain(extent(datePrice, d => d.date))
  // yScale.domain(extent(datePrice, d => d.price))
  this.xAxis.call(axisBottom().scale(xScale).ticks(20).tickSize(-height))
  this.yAxis.call(axisLeft().scale(yScale).ticks(10).tickSize(-width))
  // this.xAxis.call(axisBottom().scale(xScale).ticks(20))
  // this.yAxis.call(axisLeft().scale(yScale).ticks(20))
}

 render() {
   const datePrice = this.props.GRAPHIC
   const { NUMERIC, TEXT } = this.props
   xScale.domain(extent(datePrice, d => d.date))
   yScale.domain(extent(datePrice, d => d.price))

    var svgStyle = {
    // borderRight: '1px black solid',
    // borderBottom: '1px black solid'
      // border: '1px black solid'
    }

    return (
      <div className="lineChart">
        <div className="stockInfo">
          <h1><p>{TEXT[0]} ({TEXT[1]}) <small>sector: {TEXT[2]}</small></p></h1>
          <div className="rightInfo col-xs-6">
            <h3>open: ${NUMERIC.open}</h3>
            <h3>high: ${NUMERIC.high}</h3>
            <h3>low: ${NUMERIC.low}</h3>
          </div>
          <div className="leftInfo col-xs-6">
            <h3>close: ${NUMERIC.close}</h3>
            <h3>volume: {NUMERIC.volume}</h3>
            <small>last update: {NUMERIC.date} ({NUMERIC.alert})</small>
          </div>
        </div>
        <svg className="chart" width='100%' height='100%' viewBox={`0 0 ${fullWidth} ${fullHeight}`} style={svgStyle}>
          <CSSTransitionGroup
            transitionName="changeChart"
            transitionEnterTimeout={750}
            transitionLeaveTimeout={750} component="g">
            {/* CSSTransitionGroup turns into a <span> component if you do not specify via the 'component' attribute that it should remain some other kind of component, 'g' in this case */}
            <g transform={`translate(${margin.left},${margin.top})`}>
              <g className="xAxis" ref={r => this.xAxis = select(r) } transform={`translate(0, ${height})`}></g>
              <g className="yAxis" ref={r => this.yAxis = select(r) }></g>
              <path className="line" ref={r => this.actual = select(r) } d={lineGenerator(datePrice)}></path>
            </g>
          </CSSTransitionGroup>
        </svg>
        <div className="select">
          <form>
            {
              this.props.securities ?
                <select onChange={this.props.handleSymbolSelection}>
                  {this.props.renderOptions(this.props.securities)}
                </select> : <div>waiting on Data</div>
            }
            <select onChange={this.props.handleTimeScaleSelection}>
              {this.props.renderOptions(this.props.timeScales)}
            </select>
          </form>
        </div>
      </div>
    )
  }
}

export default LineChart
