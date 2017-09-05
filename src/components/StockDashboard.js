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
      timeScales: {'1D':1, '1W':8, '1M':32, '3M':(94), '6M':(187), '1Y':(366), '2Y':(731)},
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
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.TEXT[0]}&interval=1min&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    } else {
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.TEXT[0]}&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    }

    fetch(http)
    .then(response => {
      return response.json()
      console.log(`callDatePriceAPI fired. timeScale = ${timeScale}, this.state.TEXT[0] = ${this.state.TEXT[0]}. http = ${http} `);
    })
    .then(json => {
      console.log('callDatePriceAPI json parsing SUCCEEDED!!!')

      // API IntraDay can be imperfect, and some minutes are left out, need to check that previous trading day time isn't included
      this.checkIntraday = function(dateArray, priceArray) {
        var newDateArray = []
        var newPriceArray = []
        for (var i=0; i<dateArray.length; i++) {
          var zStr = dateArray[0]
          var zDay = zStr.charAt(5) + zStr.charAt(6)
          var iStr = dateArray[i]
          var iDay = iStr.charAt(5) + iStr.charAt(6)
          if (iDay == zDay) {
            newDateArray.push(dateArray[i])
            newPriceArray.push(priceArray[i])
          }
        }
        console.log(`are date and price arrays of equal length? ${newDateArray.length == newPriceArray.length}`);
        var newArrays = {
          dateArr: newDateArray,
          priceArr: newPriceArray
        }
        return newArrays
      }
      this.unpack = function(str) {
        var month = Number(str.charAt(5) + str.charAt(6))
        var day = Number(str.charAt(8) + str.charAt(9))
        var year = Number(str.charAt(0) + str.charAt(1) + str.charAt(2) + str.charAt(3))
        var dateInfo = {
          year: year,
          month: month - 1,
          day: day,
          date: new Date(year, month-1, day, 0, 0, 0, 0)
        }
        return dateInfo
      }

      this.checkDate = function(dateArray, priceArray, timeScale) {
        var newDateArray = []
        var newPriceArray = []
        var z = this.unpack(dateArray[0])
        var pastLimit = new Date(z.year, z.month, z.day-timeScale, 0, 0, 0, 0)
        for (var i=0; i<dateArray.length; i++) {
          var iDate = this.unpack(dateArray[i]).date
          if (pastLimit <= iDate) {
            newDateArray.push(dateArray[i])
            newPriceArray.push(priceArray[i])
          }
        }
        console.log(`are date and price arrays of equal length? ${newDateArray.length == newPriceArray.length}`);
        var newArrays = {
          dateArr: newDateArray,
          priceArr: newPriceArray
        }
        return newArrays
      }

      var dates = timeScale == 1 ? json['Time Series (1min)'] : json['Time Series (Daily)']
      var priceArray = this.exposePrices(dates)
      var dateArray = Object.keys(dates)

      if (timeScale == 1) {
        var c = this.checkIntraday(dateArray, priceArray) // c = check
        var dataScope = c.dateArr.length
        var timeString = '%Y-%m-%d %H:%M:%S'
      } else {
        var c = this.checkDate(dateArray, priceArray, timeScale) // c = check
        var dataScope = timeScale
        var timeString = '%Y-%m-%d'
      }

      var dateArray = c.dateArr
      var priceArray = c.priceArr

      console.log(`stock symbol = ${json['Meta Data']["2. Symbol"]}`)

      // console.log(`dates = ${dates}.  priceArray = ${priceArray}`);
      // Object.values(dates).map(value=>console.log("value: ", value))
      // var dataScope = timeScale == 1 ? 390 : timeScale
      // var last = dataScope - 1
      var parseTime = timeParse(timeString)
      var datePrice = []
      var lowHigh = []
      var volArr = []
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
        lowHigh.push(Number(priceArray[i][1]))
        lowHigh.push(Number(priceArray[i][2]))
        volArr.push(Number(priceArray[0][4]))
      }
      console.log(`dataScope (datePrice.length) = ${datePrice.length}`)
      console.log(`lowHigh.length = ${lowHigh.length}`)
      console.log(`volArr.length = ${volArr.length}`)

      var date = parseTime(dateArray[0])
      var formatTime = timeFormat("%b %d, %Y at %I:%M:%S %p")
      var formattedDate = formatTime(date)
      var dateStr = formattedDate.toString()
      var alert = parseTime(formattedDate) < new Date ? 'market is closed' : 'up to date'
      lowHigh.sort((a,b) => a - b)
      var highest = lowHigh[lowHigh.length-1]
      var lowest = lowHigh[0]
      this.getSum = (total,num) => total + num
      var totalVol = volArr.reduce(this.getSum)

      console.log(`highest = ${highest}. lowest = ${lowest}`  );

      var latestData = {
        date: dateStr,
        open: Number(priceArray[datePrice.length-1][0]),
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
      var timeString = '%Y-%m-%d'
      var formatTime = timeFormat(timeString)
      var dateArray = [formatTime(new Date), formatTime(new Date)]
      var dataScope = dateArray.length
      var parseTime = timeParse(timeString)
      var datePrice = []

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
