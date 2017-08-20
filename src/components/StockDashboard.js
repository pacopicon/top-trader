import React, { Component } from 'react';
import { render } from 'react-dom';
import '../styles/Stocks.css';
import BarChart from './BarChart'
import LineChart from './LineChart'
import Stock from './Stock'
import { serializeProps } from '../helpers';
// import { callSecuritiesInfoAPI } from '../securitiesHelper';
// import { tradeData, mcrsft } from '../JSONdata';
// import { microsoft } from '../ApiCalls';

class StockDashboard extends Component {
  constructor() {
    super()
    this.renderLineChart = this.renderLineChart.bind(this)
    this.changeChartParams = this.changeChartParams.bind(this)
    this.renderOptions = this.renderOptions.bind(this)
    this.handleSymbolSelection = this.handleSymbolSelection.bind(this)
    this.handleTimeScaleSelection = this.handleTimeScaleSelection.bind(this)
    this.callDatePriceAPI = this.callDatePriceAPI.bind(this)
    this.callSecuritiesInfoAPI = this.callSecuritiesInfoAPI.bind(this)
    this.state = {
      renderLineChart: true,
      securities: [{'Symbol':'MMM','Name':'3M Company', 'Sector':'Industrials'}],
      security: 'MMM',
      selection: ['MMM','3M Company', 'Industrials'],
      timeScales: {'1D':1, '1W':7, '1M':31, '3M':(31*3), '6M':(31*6), '1Y':(365), '2Y':(365*2)},
      timeScale: 1,
      datePriceData: { "Meta Data": {},"Time Series (Daily)": {} }
    }
  }

  callDatePriceAPI() {

    if (this.state.timeScale == 1) {
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.state.security}&interval=1min&apikey=5JSEEXSISXT9VKNO`
    } else {
      var http = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.security}&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    }

    fetch(http)
    .then(response => {
      return response.json()
      console.log(`callDatePriceAPI fired. this.state.timeScale = ${this.state.timeScale}, this.state.security = ${this.state.security}. http = ${http} `);
    })
    .then(json => {
      console.log('callDatePriceAPI json parsing SUCCEEDED!!!')
      this.setState({ datePriceData: json })
    })
    .catch(error => {
      console.log('callDatePriceAPI json parsing failed: ', error)
      this.setState({ datePriceData: { "Meta Data":{},"Time Series (Daily)":{} } })
    })
  }

  callSecuritiesInfoAPI() {

    var http = 'http://data.okfn.org/data/core/s-and-p-500-companies/r/constituents.json'

    fetch(http)
    .then(response => {
      return response.json()
    })
    .then(json => {
      this.setState({
        securities: json
      }, function() {
        console.log(`callSecuritiesInfoAPI json parsing SUCCEEDED!!!. call = ${http}.  json.length = ${json.length}. this.state.securities.length = ${this.state.securities.length}`)
      })

    })
    .catch(error => {
      console.log('callSecuritiesInfoAPI json parsing failed: ', error)
    })
  }

  componentDidMount() {

    this.callDatePriceAPI()
    this.callSecuritiesInfoAPI()

  }

  changeChartParams(security, timeScale) {

    if (this.state.security !== '' && this.state.timeScale !== '') {
      console.log(`First phase (changeChartParams) fired: this.state.renderLineChart = ${this.state.renderLineChart},  this.state.security = ${this.state.security}, this.state.timeScale = ${this.state.timeScale}`)
      this.setState({
        security: '',
        timeScale: 0,
        renderLineChart: false
      }, function onceStateIsUpdated() {
        this.callDatePriceAPI()
        setTimeout(() => this.changeChartParams(security, timeScale), 300)
      })
    } else if (this.state.security == '' || this.state.timeScale == '') {
      this.setState({
        security: security,
        timeScale: timeScale
      }, function onceStateIsUpdated() {
        console.log(`Second phase (changeChartParams) fired: this.state.renderLineChart = ${this.state.renderLineChart},  this.state.security = ${this.state.security}, this.state.timeScale = ${this.state.timeScale}`)
        this.setState({
          renderLineChart: true
        })
        this.callDatePriceAPI()
      })
    }
  }

  renderLineChart() {
    return this.state.renderLineChart ? <LineChart className="lineChart"
      datePriceData={this.state.datePriceData}
      security={this.state.security}
      timeScale={this.state.timeScale}
    /> : null
  }

  renderOptions(options) {
    var selection = []
    if (Array.isArray(options)) { // Does var options refer to array of Securities info objects or to Object of timeScale / modifier  key-values?
      // console.log(`options[0]['Symbol'], options[0].Name, options[0].Sector = ${options[0]['Symbol']}, ${options[0].Name}, ${options[0].Sector}`);
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
    console.log(`handleSymbolSelection ("symbol") securityObj[0] = ${securityArray[0]}`);
    this.setState({
      selection: securityArray
    }, () => console.log(`this.state.selection[1] ("name") = ${this.state.selection[1]}`))
    this.changeChartParams(this.state.selection[0], timeScale)
  }

  handleTimeScaleSelection(event) {
    const { security, timeScales } = this.state
    var modifier = timeScales[event.target.value]
    console.log("handleTimeScaleSelection modifier = ", modifier);
    console.log("typeof modifier = ", typeof modifier);
    this.changeChartParams(security, modifier)
  }

  render() {
    const { stocks } = this.props
    return (
        <div className="stocks">
        {stocks.map((stock, i) =>
            <Stock key={i} stock={stock}/>
        )}
        {this.renderLineChart()}
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
      </div>
    )
  }


}

export default StockDashboard;
