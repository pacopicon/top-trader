import React, { Component } from 'react'
import { render } from 'react-dom'
import '../styles/StockDashboard.css'
import BarChart from './BarChart'
import LineChart from './LineChart'
import { serializeProps, getSecuritiesInfo } from '../helpers'
import { timeParse, timeFormat } from 'd3-time-format'
// import { callSecuritiesInfoAPI } from '../securitiesHelper';
// import { tradeData, mcrsft } from '../JSONdata';
// import { microsoft } from '../ApiCalls';

class StockDashboard extends Component {
  constructor() {
    super()
    this.exposePrices = this.exposePrices.bind(this)
    this.renderLineChart = this.renderLineChart.bind(this)
    // this.changeChartParams = this.changeChartParams.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.handleSymbolSelection = this.handleSymbolSelection.bind(this)
    this.handleTimeScaleSelection = this.handleTimeScaleSelection.bind(this)
    this.callDatePriceAPI = this.callDatePriceAPI.bind(this)
    // this.callSecuritiesInfoAPI = this.callSecuritiesInfoAPI.bind(this)
    this.state = {
      renderLineChart: true,
      // securities: [{'Symbol':'MMM','Name':'3M Company', 'Sector':'Industrials'}],
      securities: getSecuritiesInfo(),
      security: 'MMM',
      timeScales: {'1D':1, '1W':7, '1M':31, '3M':(31*3), '6M':(31*6), '1Y':(365), '2Y':(365*2)},
      timeScale: 1,
      TEXT: ['MMM','3M Company', 'Industrials'],
      LATEST: [205.3500,205.6300,203.4500,203.5300,1830572],
      NUMERIC: [new Date, 0, 0, 0, 0, 0],
      GRAPHIC: { "Meta Data":{},"Time Series (Daily)":{} }
      // GRAPHIC: {}
    }
  }

  exposePrices(obj) {
    var result = [];
    for (var prop in obj) {
        var value = obj[prop];
        if (typeof value === 'object') {
            result.push(this.exposePrices(value)) // <- recursive call
        } else {
            result.push(value);
        }
    }
    return result;
  }

  callDatePriceAPI() {
    const { timeScale } = this.state
    if (timeScale == 1) {
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.security}&interval=1min&apikey=5JSEEXSISXT9VKNO`
    } else {
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.security}&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    }

    var timeString = timeScale == 1 ? '%Y-%m-%d %H:%M:%S' : '%Y-%m-%d'
    var parseTime = timeParse(timeString)
    var datePrice = []

    fetch(http)
    .then(response => {
      return response.json()
      console.log(`callDatePriceAPI fired. timeScale = ${timeScale}, this.state.security = ${this.state.security}. http = ${http} `);
    })
    .then(json => {
      console.log('callDatePriceAPI json parsing SUCCEEDED!!!')
      var dates = timeScale == 1 ? json['Time Series (1min)'] : json['Time Series (Daily)']
      var priceArray = this.exposePrices(dates)
      var dateArray = Object.keys(dates)
      console.log(`stock symbol = ${json['Meta Data']["2. Symbol"]}`);
      // console.log(`dates = ${dates}.  priceArray = ${priceArray}`);
      // Object.values(dates).map(value=>console.log("value: ", value))
      var dataScope = timeScale == 1 ? dateArray.length : timeScale
      this.parseData = function(dateArray, priceArray, mainIndex) {
        const dyad = {
          date: parseTime(dateArray[mainIndex]),
          price: Number(priceArray[mainIndex][3])
        }
        datePrice.push(dyad)
        return datePrice
      }

      for (var i=0; i<dataScope; i++) {
        this.parseData(dateArray, priceArray, i)
      }

      var date = parseTime(dateArray[0])
      var formatTime = timeFormat("%b %d, %Y at %I:%M:%S %p")
      var formattedDate = formatTime(date)
      var dateStr = formattedDate.toString()
      var alert = parseTime(formattedDate) < new Date ? 'market is closed' : 'up to date'

      var latestData = {
        date: dateStr,
        open: Number(priceArray[0][0]),
        high: Number(priceArray[0][1]),
        low: Number(priceArray[0][2]),
        close: Number(priceArray[0][3]),
        volume: Number(priceArray[0][4]),
        alert: alert
      }
      this.setState({
        GRAPHIC: datePrice,
        NUMERIC: latestData
       })
    })
    .catch(error => {
      console.log('callDatePriceAPI json parsing failed: ', error)
      var formatTime = timeFormat(timeString)
      var dateArray = [formatTime(new Date), formatTime(new Date)]
      var dataScope = dateArray.length

      this.parseData = function(dateArray, mainIndex) {

        const dyad = {
          date: parseTime(dateArray[mainIndex]),
          price: 0
        }
        datePrice.push(dyad)
        return datePrice
      }

      for (var i=0; i<dataScope; i++) {
        this.parseData(dateArray, i)
      }

      var dateString = (new Date).toString()

        var latestData = {
          date: dateString,
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
          nowDate: 'market is closed'
        }
      this.setState({
        GRAPHIC: { "Meta Data":{},"Time Series (Daily)":{} },
        // GRAPHIC: datePrice,
        NUMERIC: latestData
       })
    })
  }

  // callSecuritiesInfoAPI() {
  //
  //   var myHeaders = new Headers({
  //     'Access-Control-Allow-Origin': 'http://localhost:3000/',
  //     'Content-Type': 'multipart/form-data'
  //   });
  //
  //   var myInit = {
  //     method : 'GET',
  //     headers: myHeaders,
  //     mode   : 'cors',
  //     cache  : 'default'
  //   }
  //
  //   var http = 'https://pkgstore.datahub.io/core/s-and-p-500-companies/latest/data/json/data/constituents.json'
  //
  //   var myRequest = new Request(http, myInit)
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

  componentDidMount() {
    this.callDatePriceAPI()
    getSecuritiesInfo()
    // this.callSecuritiesInfoAPI()
  }

  renderLineChart() {
    return this.state.renderLineChart ? <LineChart className="lineChart"
      GRAPHIC={this.state.GRAPHIC}
      timeScale={this.state.timeScale}
      timeScales={this.state.timeScales}
      securities={this.state.securities}
      renderOptions={this.renderOptions}
      handleSymbolSelection={this.handleSymbolSelection}
      handleTimeScaleSelection={this.handleTimeScaleSelection}
    /> : null
  }

  renderOptions(options) {
    var selection = []
    if (Array.isArray(options)) { // Does var options refer to array of Securities info objects or to Object of timeScale / modifier  key-values?
      selection = (opt, i) => <option key={i} value={[opt['Symbol'], opt.Name, opt.Sector]}>{opt.Name}</option>
    } else {
      var options = Object.keys(options) // options begins as object here.  need to make it into array
      selection = (opt, i) => <option key={i} value={opt}>{opt}</option>
    }
    return options.map(selection)
  }

  // handleSymbolSelection(event) {
  //   const { timeScale } = this.state
  //   var string = event.target.value
  //   var securityArray = string.split(',')
  //   console.log(`handleSymbolSelection ("symbol") securityArray[0] = ${securityArray[0]}`);
  //   this.setState({
  //     TEXT: securityArray
  //   }, () => console.log(`this.state.TEXT[0] ("name") = ${this.state.TEXT[0]}`))
  //   this.changeChartParams(securityArray[0], timeScale)
  // }

  handleSymbolSelection(event) {
    const { timeScale } = this.state
    var string = event.target.value
    var securityArray = string.split(',')
    console.log(`handleSymbolSelection ("symbol") securityArray[0] = ${securityArray[0]}`);
    this.setState({
      TEXT: securityArray
    }, () => console.log(`this.state.TEXT[0] ("name") = ${this.state.TEXT[0]}`))
    this.setState({
      security: securityArray[0],
      timeScale: timeScale
    }, function onceStateIsUpdated() {
      this.callDatePriceAPI()
    })
  }

  handleTimeScaleSelection(event) {
    const { security, timeScales } = this.state
    var modifier = timeScales[event.target.value]
    console.log("handleTimeScaleSelection modifier = ", modifier);
    console.log("typeof modifier = ", typeof modifier);
    this.setState({
      security: security,
      timeScale: modifier
    }, function onceStateIsUpdated() {
      this.callDatePriceAPI()
    })
  }

  // changeChartParams(security, timeScale) {
  //
  //   if (this.state.security !== '' && this.state.timeScale !== '') {
  //     console.log(`First phase (changeChartParams) fired: this.state.renderLineChart = ${this.state.renderLineChart},  this.state.security = ${this.state.security}, this.state.timeScale = ${this.state.timeScale}`)
  //     this.setState({
  //       security: '',
  //       timeScale: 0,
  //       renderLineChart: false
  //     }, function onceStateIsUpdated() {
  //       this.callDatePriceAPI()
  //       setTimeout(() => this.changeChartParams(security, timeScale), 300)
  //     })
  //   } else if (this.state.security == '' || this.state.timeScale == '') {
  //     this.setState({
  //       security: security,
  //       timeScale: timeScale
  //     }, function onceStateIsUpdated() {
  //       console.log(`Second phase (changeChartParams) fired: this.state.renderLineChart = ${this.state.renderLineChart},  this.state.security = ${this.state.security}, this.state.timeScale = ${this.state.timeScale}`)
  //       this.setState({
  //         renderLineChart: true
  //       })
  //       this.callDatePriceAPI()
  //     })
  //   }
  // }

  render() {
    const { selection, TEXT, NUMERIC } = this.state
    return (
        <div className="dashboard">
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
          <div className="chart">
            {this.renderLineChart()}
          </div>
          {/* <div className="select">
            <form>
              {
                this.state.securities ?
                  <select onChange={this.handleSymbolSelection}>
                    {this.renderOptions(this.state.securities)}
                  </select> : <div>waiting on Data</div>
              }
              <select onChange={this.handleTimeScaleSelection}>
                {this.renderOptions(this.state.timeScales)}
              </select>
            </form>
          </div> */}
      </div>
    )
  }


}

export default StockDashboard;
