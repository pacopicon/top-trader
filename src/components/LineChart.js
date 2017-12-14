import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { withFauxDOM } from 'react-faux-dom'
import '../styles/LineChart.css'
// import { scaleLinear, scaleTime } from 'd3-scale'
// import { axisBottom, axisLeft } from 'd3-axis'
// import { extent } from 'd3-array'
// import { line } from 'd3-shape'
// import { select } from 'd3-selection'
// import { transition } from 'd3-transition'
// import * as ease from 'd3-ease'
// import { TransitionGroup } from 'react-transition-group'
import * as d3 from 'd3'

// Code Research Resources:
// http://paulhoughton.github.io/mortgage/
// https://github.com/paulhoughton/mortgage/blob/master/src/components/Chart.js
// https://www.npmjs.com/package/d3

// Code sources
// d3noob's vanilla JS transitional chart: http://bl.ocks.org/d3noob/7030f35b72de721622b8
// https://github.com/dpwrussell/d3animatedchartinreact/blob/gh-pages/index.js

const margin = {top: 20, right: 20, bottom: 80, left: 50},
  fullWidth = 960,
  fullHeight = 600,
  width = fullWidth - margin.left - margin.right,
  height = fullHeight - margin.top - margin.bottom

// const easement = ease.easeBounce

const xScale = d3.scaleTime().rangeRound([0, width])
const yScale = d3.scaleLinear().rangeRound([height, 0])

const lineGenerator = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.price))

class LineChart extends Component {
  constructor(props){
    super(props)
    this.renderD3chart = this.renderD3chart.bind(this)
    this.updateD3chart = this.updateD3chart.bind(this)
    // this.lineGenerator = this.lineGenerator.bind(this)
    this.state = {
      chart: "Loading..."
    }
  }

  componentDidMount() {
    this.renderD3chart()
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.GRAPHIC !== this.props.GRAPHIC) {
  //     this.renderD3chart()
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.GRAPHIC !== this.props.GRAPHIC) {
      this.updateD3chart()
    }
  }

  render() {

    const { NUMERIC, TEXT } = this.props
    
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
            <h3>volume: {NUMERIC.totalVol}</h3>
            <small>last update: {NUMERIC.date} ({NUMERIC.alert})</small>
          </div>
        </div>
        { this.props.chart }
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

  // <div className="lineChart">
  //       <div className="stockInfo">
  //         <h1><p>{TEXT[0]} ({TEXT[1]}) <small>sector: {TEXT[2]}</small></p></h1>
  //         <div className="rightInfo col-xs-6">
  //           <h3>open: ${NUMERIC.open}</h3>
  //           <h3>high: ${NUMERIC.high}</h3>
  //           <h3>low: ${NUMERIC.low}</h3>
  //         </div>
  //         <div className="leftInfo col-xs-6">
  //           <h3>close: ${NUMERIC.close}</h3>
  //           <h3>volume: {NUMERIC.totalVol}</h3>
  //           <small>last update: {NUMERIC.date} ({NUMERIC.alert})</small>
  //         </div>
  //       </div>
  //       <div className="select">
  //         <form>
  //           {
  //             this.props.securities ?
  //               <select onChange={this.props.handleSymbolSelection}>
  //                 {this.props.renderOptions(this.props.securities)}
  //               </select> : <div>waiting on Data</div>
  //           }
  //           <select onChange={this.props.handleTimeScaleSelection}>
  //             {this.props.renderOptions(this.props.timeScales)}
  //           </select>
  //         </form>
  //       </div>
  //     </div>

  // lineGenerator(d) {
  //   d3.line()
  //   .x(d => xScale(d.date))
  //   .y(d => yScale(d.price))
  // }

  renderD3chart() {
    var datePrice = this.props.GRAPHIC

    var faux = this.props.connectFauxDOM('div', 'chart')

    var svg = d3.select(faux).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    xScale.domain(d3.extent(datePrice, d => d.date))
    yScale.domain(d3.extent(datePrice, d => d.price))

    var xAxis = d3.axisBottom().scale(xScale).ticks(20).tickSize(-height)
    var yAxis = d3.axisLeft().scale(yScale).ticks(10).tickSize(-width)

    svg.append("path")
      .attr("class", "line")
      .attr("d", lineGenerator(datePrice))
      .transition().duration(500)

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  }

  updateD3chart() {
    var datePrice = this.props.GRAPHIC

    var faux = this.props.connectFauxDOM('div', 'chart')

    var svg = d3.select(faux).select("svg")

    xScale.domain(d3.extent(datePrice, d => d.date))
    yScale.domain(d3.extent(datePrice, d => d.price))

    var xAxis = d3.axisBottom().scale(xScale).ticks(20).tickSize(-height)
    var yAxis = d3.axisLeft().scale(yScale).ticks(10).tickSize(-width)

    // var svg = select(faux).transition()

    // var line = svg.select(".line")

    svg.select('.line')
      .datum(datePrice)
        .attr({
          'd': lineGenerator,
          'stroke-dasharray': '385 385',
          'stroke-dashoffset': 385
        })
      .transition()
        .duration(1500)
        .attr('stroke-dashoffset', 0)


        // .datum(data)
        //         .attr("class", "line")
        //         .transition()
        //         .duration(500)
    
    // line.attr("d", lineGenerator(datePrice)).transition().duration(500)
    


    var x = svg.select(".x.axis").call(xAxis)
    var y = svg.select(".y.axis").call(yAxis)


    

    // line.exit().remove()
    // line.enter()
    //   .append("path")
    //   .attr("class", "line")
    //   .attr("d", lineGenerator(datePrice))

    // x.exit().remove()
    // x.enter()
    //   .append("g")
    //   .attr("class", "y axis")

    // y.exit().remove()
    // y.enter()
    //   .append("g")
    //   .attr("class", "y axis")

    // line
    //   .transition()   
    //   .duration(750)
    //   .attr("d", lineGenerator(datePrice))
    // x 
    //   .transition() 
    //   .duration(750)
    //   .call(xAxis)
    // y 
    //   .transition()
    //   .duration(750)
    //   .call(yAxis)

    this.props.animateFauxDOM(2000)

  }

  // render() {
    
  //   const { NUMERIC, TEXT } = this.props
    

  //   var svgStyle = {
  //   // borderRight: '1px black solid',
  //   // borderBottom: '1px black solid'
  //     // border: '1px black solid'
  //   }

  //   return (
  //     <div className="lineChart">
  //       <div className="stockInfo">
  //         <h1><p>{TEXT[0]} ({TEXT[1]}) <small>sector: {TEXT[2]}</small></p></h1>
  //         <div className="rightInfo col-xs-6">
  //           <h3>open: ${NUMERIC.open}</h3>
  //           <h3>high: ${NUMERIC.high}</h3>
  //           <h3>low: ${NUMERIC.low}</h3>
  //         </div>
  //         <div className="leftInfo col-xs-6">
  //           <h3>close: ${NUMERIC.close}</h3>
  //           <h3>volume: {NUMERIC.totalVol}</h3>
  //           <small>last update: {NUMERIC.date} ({NUMERIC.alert})</small>
  //         </div>
  //       </div>
  //       <div className="select">
  //         <form>
  //           {
  //             this.props.securities ?
  //               <select onChange={this.props.handleSymbolSelection}>
  //                 {this.props.renderOptions(this.props.securities)}
  //               </select> : <div>waiting on Data</div>
  //           }
  //           <select onChange={this.props.handleTimeScaleSelection}>
  //             {this.props.renderOptions(this.props.timeScales)}
  //           </select>
  //         </form>
  //       </div>
  //     </div>
  //   )
  // }
}

LineChart.defaultProps = {
  chart: 'loading...'
}

const FauxChart = withFauxDOM(LineChart)

export default FauxChart