import React, { Component } from 'react'
import '../styles/StockDashboard.css'
import LineChart from './LineChart'
import { getSecuritiesInfo } from '../helpers'
import { timeParse, timeFormat } from 'd3-time-format'
// import { callSecuritiesInfoAPI } from '../securitiesHelper';
// import { tradeData, mcrsft } from '../JSONdata';
// import { microsoft } from '../ApiCalls';

class StockDashboard extends Component {
  constructor() {
    super()
    this.state = {
      isFinDataHere: false,
      body_width: document.body.clientWidth,
      securities: getSecuritiesInfo(),
      security: 'MMM',
      timeScales: {'1D':1, '1W':8, '1M':32, '3M':(94), '6M':(187), '1Y':(366), '2Y':(731)},
      timeScale: 1,
      TEXT: ['MMM','3M Company', 'Industrials'],
      NUMERIC: [new Date(), 0, 0, 0, 0, 0, 0],
      data: [0,0,0,0,0],
      GRAPHIC: { "Meta Data":{},"Time Series (Daily)":{} }
    }

    this.exposePrices = this.exposePrices.bind(this)
    this.renderSecuritiesOptions = this.renderSecuritiesOptions.bind(this)
    this.renderTimeOptions = this.renderTimeOptions.bind(this)
    this.handleSymbolSelection = this.handleSymbolSelection.bind(this)
    this.handleTimeScaleSelection = this.handleTimeScaleSelection.bind(this)
    this.callDatePriceAPI = this.callDatePriceAPI.bind(this)
    window.addEventListener("resize", this.resize().bind(this));
    // this.callSecuritiesInfoAPI = this.callSecuritiesInfoAPI.bind(this)
    
  }

  resize() {
    let t;

    return event => {
      if (t) {
        clearTimeout(t)
      }
      t = setTimeout( () => {
        const state = Object.assign(this.state, {
          body_width: document.body.clientWidth
        });
        this.setState(state)
      }, 100)
    }
  }


  exposePrices(obj) {
    let result = [];
    for (let prop in obj) {
      let value = obj[prop];
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
    let http = ''
    if (timeScale === 1) {
      http = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.TEXT[0]}&interval=1min&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    } else {
      http = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.TEXT[0]}&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    }

    fetch(http)
    .then(response => {
      return response.json()
    })
    .then(json => {
      console.log('callDatePriceAPI json parsing SUCCEEDED!!!')

      // API IntraDay can be imperfect, and some minutes are left out, need to check that previous trading day time isn't included
      this.checkIntraday = function(dateArray, priceArray) {
        let 
          newDateArray = [],
          newPriceArray = []
        for (let i=0; i<dateArray.length; i++) {
          let 
            zStr = dateArray[0],
            zDay = zStr.charAt(8) + zStr.charAt(9),
            iStr = dateArray[i],
            iDay = iStr.charAt(8) + iStr.charAt(9)
          if (iDay === zDay) {
            newDateArray.push(dateArray[i])
            newPriceArray.push(priceArray[i])
          }
        }
        // let lastStr = dateArray[dateArray.length-1]
        // let lastDay = lastStr.charAt(8) + lastStr.charAt(9)
        // console.log(`last in dateArray = ${lastDay}`);
        // console.log(`are date and price arrays of equal length? ${newDateArray.length= == newPriceArray.length}`);
        let newArrays = {
          dateArr: newDateArray,
          priceArr: newPriceArray
        }
        return newArrays
      }
      this.unpack = function(str) {
        let 
          month = Number(str.charAt(5) + str.charAt(6)),
          day = Number(str.charAt(8) + str.charAt(9)),
          year = Number(str.charAt(0) + str.charAt(1) + str.charAt(2) + str.charAt(3)),
          dateInfo = {
            year: year,
            month: month - 1,
            day: day,
            date: new Date(year, month-1, day, 0, 0, 0, 0)
          }
        return dateInfo
      }

      this.checkDate = function(dateArray, priceArray, timeScale) {
        let 
          newDateArray  = [],
          newPriceArray = [],
          z             = this.unpack(dateArray[0]),
          pastLimit     = new Date(z.year, z.month, z.day-timeScale, 0, 0, 0, 0)

        for (let i=0; i<dateArray.length; i++) {
          let iDate = this.unpack(dateArray[i]).date
          if (pastLimit <= iDate) {
            newDateArray.push(dateArray[i])
            newPriceArray.push(priceArray[i])
          }
        }

        let newArrays = {
          dateArr: newDateArray,
          priceArr: newPriceArray
        }
        return newArrays
      }

      let 
        dates = timeScale === 1 ? json['Time Series (1min)'] : json['Time Series (Daily)'],
        priceArr = this.exposePrices(dates),
        dateArr = Object.keys(dates),
        f,
        timeString

      if (timeScale === 1) {
        f = this.checkIntraday(dateArr, priceArr) // f = filtered
        timeString = '%Y-%m-%d %H:%M:%S'
      } else {
        f = this.checkDate(dateArr, priceArr, timeScale) // f = filtered
        timeString = '%Y-%m-%d'
      }
      let 
        dataScope  = f.dateArr.length,
        dateArray  = f.dateArr,
        priceArray = f.priceArr,
        parseTime  = timeParse(timeString),
        datePrice  = [],
        lowHigh    = [],
        volArr     = []

      this.parseData = function(dateArray, priceArray, i) {
        const dyad = {
          date: parseTime(dateArray[i]),
          price: Number(priceArray[i][3])
        }
        datePrice.push(dyad)
        return datePrice
      }

      for (let i=0; i<dataScope; i++) {
        this.parseData(dateArray, priceArray, i)
        lowHigh.push(Number(priceArray[i][1]))
        lowHigh.push(Number(priceArray[i][2]))
        volArr.push(Number(priceArray[i][4]))
      }
    
      let 
        date          = parseTime(dateArray[0]),
        formatTime    = timeFormat("%b %d, %Y at %I:%M:%S %p"),
        formattedDate = formatTime(date),
        dateStr       = formattedDate.toString(),
        alert         = parseTime(formattedDate) < new Date ? 'market is closed' : 'up to date'
      
      lowHigh.sort((a,b) => a - b)
        
      let
        highest = lowHigh[lowHigh.length-1],
        lowest = lowHigh[0]
      
      this.getSum = (total,num) => total + num
      let totalVol = volArr.reduce(this.getSum)

      let latestData = {
        date: dateStr,
        open: Number(priceArray[datePrice.length-1][0]),
        high: highest,
        low: lowest,
        close: Number(priceArray[0][3]),
        // volume: Number(priceArray[0][4]),
        totalVol: totalVol,
        alert: alert
      }

      let data = [
        Number(priceArray[datePrice.length-1][0]), highest, lowest, Number(priceArray[0][3]), totalVol ]

      this.setState({
        GRAPHIC: datePrice,
        NUMERIC: latestData,
        data: data,
        isFinDataHere: true
       })
    })
    .catch(error => {
      console.log('callDatePriceAPI json parsing failed: ', error)
      let 
        timeString = '%Y-%m-%d',
        formatTime = timeFormat(timeString),
        dateArray  = [formatTime(new Date), formatTime(new Date)],
        dataScope  = dateArray.length,
        parseTime  = timeParse(timeString),
        datePrice  = []

      this.parseData = function(dateArray, mainIndex) {

        const dyad = {
          date: parseTime(dateArray[mainIndex]),
          price: 0
        }
        datePrice.push(dyad)
        return datePrice
      }

      for (let i=0; i<dataScope; i++) {
        this.parseData(dateArray, i)
      }

      let 
        dateString = (new Date).toString(),
        latestData = {
          date: dateString,
          open: 0,
          high: 0,
          low: 0,
          close: 0,
          volume: 0,
          nowDate: 'market is closed'
        }

      this.setState({
        isFinDataHere: true,
        GRAPHIC: { "Meta Data":{},"Time Series (Daily)":{} },
        // GRAPHIC: datePrice,
        NUMERIC: latestData,
        data: [0,0,0,0,0]
       })
    })
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

  componentWillMount() {
    this.callDatePriceAPI()
    getSecuritiesInfo()
    // this.callSecuritiesInfoAPI()
  }

  renderSecuritiesOptions() {
    let { securities } = this.state
    
    if (securities) {
      let selectOptions = securities.map((security) => 
        <option key={security.Symbol} value={security.Symbol}>{security.Symbol}</option>
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
    const { timeScale } = this.state
    let string = event.target.value
    let securityArray = string.split(',')
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
    let modifier = timeScales[event.target.value]
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
        {
          this.state.isFinDataHere 
          ? <div>
              <LineChart className="lineChart"
                width={this.state.body_width}
                height={400}
                margin={{top: 20, right: 20, bottom: 80, left: 50}}
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
      </div>
    )
  }


}

export default StockDashboard;
