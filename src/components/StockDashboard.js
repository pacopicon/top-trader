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
    this.renderOptions = this.renderOptions.bind(this)
    this.handleSymbolSelection = this.handleSymbolSelection.bind(this)
    this.handleTimeScaleSelection = this.handleTimeScaleSelection.bind(this)
    this.callDatePriceAPI = this.callDatePriceAPI.bind(this)
    // this.callSecuritiesInfoAPI = this.callSecuritiesInfoAPI.bind(this)
    this.state = {
      securities: getSecuritiesInfo(),
      security: 'MMM',
      timeScales: {'1D':1, '1W':7, '1M':31, '3M':(31*3), '6M':(31*6), '1Y':(365), '2Y':(365*2)},
      timeScale: 1,
      TEXT: ['MMM','3M Company', 'Industrials'],
      NUMERIC: [new Date, 0, 0, 0, 0, 0, 0],
      GRAPHIC: { "Meta Data":{},"Time Series (Daily)":{} }
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
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.TEXT[0]}&interval=1min&apikey=5JSEEXSISXT9VKNO`
    } else {
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.TEXT[0]}&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    }

    var timeString = timeScale == 1 ? '%Y-%m-%d %H:%M:%S' : '%Y-%m-%d'
    var parseTime = timeParse(timeString)
    var datePrice = []

    fetch(http)
    .then(response => {
      return response.json()
      console.log(`callDatePriceAPI fired. timeScale = ${timeScale}, this.state.TEXT[0] = ${this.state.TEXT[0]}. http = ${http} `);
    })
    .then(json => {
      console.log('callDatePriceAPI json parsing SUCCEEDED!!!')
      var dates = timeScale == 1 ? json['Time Series (1min)'] : json['Time Series (Daily)']
      var priceArray = this.exposePrices(dates)
      var dateArray = Object.keys(dates)

      console.log(`stock symbol = ${json['Meta Data']["2. Symbol"]}`)

      // console.log(`dates = ${dates}.  priceArray = ${priceArray}`);
      // Object.values(dates).map(value=>console.log("value: ", value))
      var dataScope = timeScale == 1 ? dateArray.length : timeScale
      var datePrice = []
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
      console.log(`time scale = ${datePrice.length}`)

      var date = parseTime(dateArray[0])
      var formatTime = timeFormat("%b %d, %Y at %I:%M:%S %p")
      var formattedDate = formatTime(date)
      var dateStr = formattedDate.toString()
      var alert = parseTime(formattedDate) < new Date ? 'market is closed' : 'up to date'

        var length = priceArray.length
        var last = length-1
        var highArr = []
        for (var i=0; i<length; i++) {
          highArr.push(Number(priceArray[i][1]))
          highArr.push(Number(priceArray[i][2]))
        }
        highArr.sort((a,b) => a - b)
        var highest = highArr[highArr.last]
        var lowest = highArr[0]

        var volArr = []
        for (var i=0; i<length; i++) {
          volArr.push(Number(priceArray[0][4]))
        }
        this.getSum = (total,num) => total + num

        var totalVol = volArr.reduce(this.getSum)

        console.log(`highest = ${highest}. lowest = ${lowest}`  );

        var latestData = {
          date: dateStr,
          open: Number(priceArray[last][0]),
          high: highest,
          low: lowest,
          close: Number(priceArray[0][3]),
          volume: Number(priceArray[0][4]),
          totalVol: totalVol,
          alert: alert
        }

      // var latestData = {
      //   date: dateStr,
      //   open: Number(priceArray[0][0]),
      //   high: Number(priceArray[0][1]),
      //   low: Number(priceArray[0][2]),
      //   close: Number(priceArray[0][3]),
      //   volume: Number(priceArray[0][4]),
      //   alert: alert
      // }
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

  handleSymbolSelection(event) {
    const { timeScale } = this.state
    var string = event.target.value
    var securityArray = string.split(',')
    console.log(`handleSymbolSelection ("symbol") securityArray[0] = ${securityArray[0]}`);
    this.setState({
      TEXT: securityArray,
      timeScale: timeScale
    }, function onceStateIsUpdated() {
      this.callDatePriceAPI()
    })
  }

  handleTimeScaleSelection(event) {
    const { TEXT, timeScales } = this.state
    var modifier = timeScales[event.target.value]
    console.log("handleTimeScaleSelection modifier = ", modifier);
    console.log("typeof modifier = ", typeof modifier);
    // this.changeChartParams(security, modifier)
    this.setState({
      TEXT: TEXT,
      timeScale: modifier
    }, function onceStateIsUpdated() {
      this.callDatePriceAPI()
    })
  }

  render() {
    return (
        <div className="dashboard">
          <LineChart className="lineChart"
            GRAPHIC={this.state.GRAPHIC}
            TEXT={this.state.TEXT}
            NUMERIC={this.state.NUMERIC}
            timeScale={this.state.timeScale}
            timeScales={this.state.timeScales}
            securities={this.state.securities}
            renderOptions={this.renderOptions}
            handleSymbolSelection={this.handleSymbolSelection}
            handleTimeScaleSelection={this.handleTimeScaleSelection}
          />
      </div>
    )
  }


}

export default StockDashboard;
