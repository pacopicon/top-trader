import React, { Component } from 'react'
import '../styles/StockDashboard.css'
import LineChart from './LineChart'
import LineChart2 from './LineChart2'
import { getSecuritiesInfo } from '../helpers'
// import { timeParse, timeFormat } from 'd3-time-format'
import callDatePriceAPI from './APIcall'
// import { callSecuritiesInfoAPI } from '../securitiesHelper';
// import { tradeData, mcrsft } from '../JSONdata';
// import { microsoft } from '../ApiCalls';

const widMod = .60

class StockDashboard extends Component {
  constructor() {
    super()
    this.state = {
      isFinDataHere: false,
      body_width: document.body.clientWidth * widMod,
      securities: getSecuritiesInfo(),
      security: 'MMM',
      timeScales: {'1D':1, '1W':8, '1M':32, '3M':(94), '6M':(187), '1Y':(366), '2Y':(731)},
      timeScale: '',
      // TEXT: ['MMM','3M Company', 'Industrials'],
      TEXT: '',
      NUMERIC: [new Date(), 0, 0, 0, 0, 0, 0],
      data: [0,0,0,0,0],
      GRAPHIC: { "Meta Data":{},"Time Series (Daily)":{} }
    }

    this.renderSecuritiesOptions = this.renderSecuritiesOptions.bind(this)
    this.renderTimeOptions = this.renderTimeOptions.bind(this)
    this.handleSymbolSelection = this.handleSymbolSelection.bind(this)
    this.handleTimeScaleSelection = this.handleTimeScaleSelection.bind(this)
    this.updateData = this.updateData.bind(this)
    window.addEventListener("resize", this.resize().bind(this));
    // this.callSecuritiesInfoAPI = this.callSecuritiesInfoAPI.bind(this)
    // callDatePriceAPI(1, 'MMM', this.updateData)
    
  }

  resize() {
    let t;

    return event => {
      if (t) {
        clearTimeout(t)
      }
      t = setTimeout( () => {
        const state = Object.assign(this.state, {
          body_width: document.body.clientWidth * widMod
        });
        this.setState(state)
      }, 100)
    }
  }

  

  // callSecuritiesInfoAPI() {
  //
  //   let myHeaders = new Headers({
  //     'Access-Control-Allow-Origin': 'http://localhost:3000/',
  //     'Content-Type': 'multipart/form-data'
  //   });
  //
  //   let myInit = {
  //     method : 'GET',
  //     headers: myHeaders,
  //     mode   : 'cors',
  //     cache  : 'default'
  //   }
  //
  //   let http = 'https://pkgstore.datahub.io/core/s-and-p-500-companies/latest/data/json/data/constituents.json'
  //
  //   let myRequest = new Request(http, myInit)
  //
  //   fetch(myRequest)
  //   .then(response => {
  //     return response.json()
  //   })
  //   .then(json => {
  //     this.setState({
  //       securities: json
  //     }, function() {
  //       console.log(`callSecuritiesInfoAPI json parsing SUCCEEDED!!!. call = ${http}.  json.length = ${json.length}. this.state.securities.length = ${this.state.securities.length}`)
  //     })
  //
  //   })
  //   .catch(error => {
  //     console.log('callSecuritiesInfoAPI json parsing failed: ', error)
  //   })
  // }

  updateData(datePrice, latestData, data, boolean) {
    this.setState({
      GRAPHIC: datePrice,
      NUMERIC: latestData,
      data: data,
      isFinDataHere: boolean
     })
  }

  componentWillMount() {
    this.setState({
      TEXT: ['MMM','3M Company', 'Industrials'],
      timeScale: 1
    }, () => {
      callDatePriceAPI(this.state.timeScale, this.state.TEXT[0], this.updateData)
    })
  }

  // componentDidMount() {
  //   const { timeScale, TEXT } = this.state
  //   if (timeScale && TEXT) {
      
  //   }
  //   getSecuritiesInfo()
  //   // this.callSecuritiesInfoAPI()
  // }

  // componentDidMount() {
  //   this.setState({
  //     TEXT: ['MMM','3M Company', 'Industrials'],
  //     timeScale: 1
  //   }, () => {
  //     callDatePriceAPI(this.state.timeScale, this.state.TEXT[0], this.updateData)
  //   })
  // }



  // componentWillUpdate(nextProps, nextState) {
  //   let
  //     oldSymbol = this.state.TEXT[0],
  //     newSymbol = nextState.TEXT[0],
  //     newTimeScale = nextState.timeScale

  //   if (oldSymbol != newSymbol) {
  //     callDatePriceAPI(newTimeScale, newSymbol, this.updateData)
  //   }
  // }



  renderSecuritiesOptions() {
    let { securities } = this.state
    
    if (securities) {
      let selectOptions = securities.map((security) => 
        <option key={security.Symbol} value={security.Symbol + ',' + security.Name + ',' + security.Sector}>{security.Symbol}</option>
      )
  
      return (
        <select onChange={this.handleSymbolSelection}>
          {selectOptions}
        </select> 
      )
    }
  }

  renderTimeOptions() {
    let { timeScales } = this.state

    if (timeScales) {
      let 
        periods       = Object.keys(timeScales),
        selectOptions = periods.map((period) => 
          <option key={period} value={timeScales[period]}>{period}</option>
        )
  
      return (
        <select onChange={this.handleTimeScaleSelection}>
          {selectOptions}
        </select> 
      )
    }
  }

  handleSymbolSelection(event) {
    let { timeScale } = this.state
    let string = event.target.value
    let securityArray = string.split(',')
    console.log('securityArray = ', securityArray);
    this.setState({
      TEXT: securityArray,
      timeScale: timeScale
    }, () => {
      let { timeScale, TEXT } = this.state
      if (timeScale && TEXT) {
        callDatePriceAPI(timeScale, TEXT[0], this.updateData)
      }
    })
  }

  handleTimeScaleSelection(event) {
    const { TEXT, timeScales, timeScale } = this.state
    let modifier = timeScales[event.target.value]
    console.log("handleTimeScaleSelection modifier = ", modifier);
    console.log("typeof modifier = ", typeof modifier);
    // this.changeChartParams(security, modifier)
    this.setState({
      TEXT: TEXT,
      timeScale: modifier
    }, () => {
      let { timeScale, TEXT } = this.state
      if (timeScale && TEXT) {
        callDatePriceAPI(timeScale, TEXT[0], this.updateData)
      }
    })
  }

  render() {

    return (
      <div className="dashboard">
        {
          this.state.isFinDataHere 
          ? <div className="LineChartContainer">
              <LineChart className="lineChart"
                width={this.state.body_width}
                height={400}
                margin={{top: 20, right: 100, bottom: 80, left: 50}}
                GRAPHIC={this.state.GRAPHIC}
                TEXT={this.state.TEXT}
                NUMERIC={this.state.NUMERIC}
                timeScale={this.state.timeScale}
                timeScales={this.state.timeScales}
                securities={this.state.securities}
                renderSecuritiesOptions={this.renderSecuritiesOptions}
                renderTimeOptions={this.renderTimeOptions}
                handleSymbolSelection={this.handleSymbolSelection}
                handleTimeScaleSelection={this.handleTimeScaleSelection}
              />
            </div>
          : ''
        }
        {
          this.state.isFinDataHere 
          ? <div className="LineChartContainer">
              <LineChart2 />
            </div>
          : ''
        }
      </div>
    )
  }


}

export default StockDashboard;
