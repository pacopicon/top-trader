import React, { Component } from 'react'
import '../styles/LineChart.css'
// import { scaleLinear, scaleTime } from 'd3-scale'
// import { axisBottom, axisLeft } from 'd3-axis'
// import { extent } from 'd3-array'
// import { line } from 'd3-shape'
// import { select } from 'd3-selection'
// import { transition } from 'd3-transition'
// import * as ease from 'd3-ease'
// import { TransitionGroup } from 'react-transition-group'
import * as d3 from "d3";
import { XAxis, YAxis, YGrid, Line } from "./ChartComponents.js";

class LineChart extends Component {
  constructor(props){
    super(props) 
    
    this.renderLineChart = this.renderLineChart.bind(this)
  }

  xFn = (d) => {
    return d.date
  }

  yFn = (d) => {
    return d.price
  }

  updateScale(props) {
    const datePrice = props.GRAPHIC;
    const xScale = d3.scaleTime();
    const yScale = d3.scaleLinear().nice();

    const xDomain = d3.extent(datePrice, d => d.date);
    const yDomain = d3.extent(datePrice, d => d.price);

    xScale
      .domain(xDomain)
      .range([0, props.width - (props.margin.left + props.margin.right)]);

    
    yScale
      .domain(yDomain)
      .range([props.height - (props.margin.top + props.margin.bottom), 0]);
      
      return {xScale, yScale}
  }
  
  updatePlotSize(props){
    const plotWidth =
      props.width - (props.margin.left + props.margin.right);
    const plotHeight =
      props.height - (props.margin.top + props.margin.bottom);
      
      return {plotWidth, plotHeight}
    
    
  }

  renderLineChart(datePriceData) {
    if (datePriceData) {
      const
        { xScale, yScale } = this.updateScale(this.props),
        { plotWidth, plotHeight } = this.updatePlotSize(this.props)
    
      console.log('datePriceData = ', datePriceData)
      console.log('xScale(this.xFn(datePriceData)) = ', xScale(this.xFn(datePriceData)))
      
      let metaData, plotData
        
      metaData = {
        xScale: xScale,
        yScale: yScale,
        plotWidth: plotWidth,
        plotHeight: plotHeight,
        xSlide: xScale(this.xFn(datePriceData)),
        ySlide: yScale(this.yFn(datePriceData))
      },
      plotData = {
        plotData: datePriceData.map((d, i) => {
          return {
            id: i,
            data: d,
            x: xScale(this.xFn(d)),
            y: yScale(this.yFn(d))
          };
        })
      }

      console.log('metaData = ', metaData)
      console.log('plotData = ', plotData)

      return (
        <div className="chartContainer">
          <svg width={this.props.width} height={this.props.height}>
            <g
              className="axisLaeyr"
              width={plotWidth}
              height={plotHeight}
              transform={`translate(${this.props.margin.left}, ${this.props.margin
                .top})`}
            >
              <YGrid {...metaData} />
              <XAxis {...metaData} transform={`translate(0,${plotHeight})`} />
              {/*<YAxis {...metaData} />*/}
              <YAxis {...metaData} transform={`translate(${plotWidth}, 0)`} />
            </g>
            <g
              className="plotLayer"
              width={plotWidth}
              height={plotHeight}
              transform={`translate(${this.props.margin.left}, ${this.props.margin
                .top})`}
            >
              <Line {...metaData} {...plotData} />
            </g>
          </svg>
        </div>
      )
    } else {
      return <div>Fetching data...</div>
    }

  }

  render() {

    const 
      datePriceData      = this.props.GRAPHIC,
      { NUMERIC, TEXT }  = this.props
    
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
        { this.renderLineChart(datePriceData) }
        <div className="select">
          <form>
            {
              this.props.securities 
                ? this.props.renderSecuritiesOptions()
                : <div>waiting on Data</div> 
            }
            { this.props.renderTimeOptions() }
          </form>
        </div>
      </div>
    )
  }

}

export default LineChart