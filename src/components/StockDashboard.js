import React, { Component } from 'react';
import { render } from 'react-dom';
import '../styles/Stocks.css';
import BarChart from './BarChart'
import LineChart from './LineChart'
import Stock from './Stock'
import { serializeProps } from '../helpers';
// import { tradeData, mcrsft } from '../JSONdata';
// import { microsoft } from '../ApiCalls';

class StockDashboard extends Component {
  constructor() {
    super()
    this.state = {
      MSFTData: {
        symbol: '',
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0
      }, data: {
                  "Meta Data": {
                      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
                      "2. Symbol": "MSFT",
                      "3. Last Refreshed": "2017-08-11",
                      "4. Output Size": "Full size",
                      "5. Time Zone": "US/Eastern"
                  },
                  "Time Series (Daily)": {
                      "2017-08-11": {
                          "1. open": "71.6100",
                          "2. high": "72.7000",
                          "3. low": "71.2800",
                          "4. close": "72.5000",
                          "5. volume": "21121250"
                      },
                      "2017-08-10": {
                          "1. open": "71.9000",
                          "2. high": "72.1900",
                          "3. low": "71.3500",
                          "4. close": "71.4100",
                          "5. volume": "23153711"
                      },
                      "2017-08-09": {
                          "1. open": "72.2500",
                          "2. high": "72.5100",
                          "3. low": "72.0500",
                          "4. close": "72.4700",
                          "5. volume": "20401071"
                      }
                  }
              }
    }
  }

  componentDidMount() {
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=5JSEEXSISXT9VKNO')
      .then(response => {
        return response.json()
        console.log('response.json(): ', response.json())
      })
      .then(json => {
        console.log('parsed json: ', json)
        // USUAL WAY: this.setState({ microsoft: json })
        // CAN'T DO THIS with a nested state THOUGH.  Need to do this instead:
        // this.setState( { MSFTData.symbol: json['Meta Data']['2. Symbol'] } )
        var symbol = json['Meta Data']['2. Symbol']
        var open = json['Time Series (Daily)']['2017-08-11']['1. open']
        var high = json['Time Series (Daily)']['2017-08-11']['2. high']
        var low = json['Time Series (Daily)']['2017-08-11']['3. low']
        var close = json['Time Series (Daily)']['2017-08-11']['4. close']
        var volume = json['Time Series (Daily)']['2017-08-11']['5. volume']
        this.setState({ MSFTData: {...this.state.MSFTData, symbol: symbol} })
        this.setState({ MSFTData: {...this.state.MSFTData, open: open} })
        this.setState({ MSFTData: {...this.state.MSFTData, high: high} })
        this.setState({ MSFTData: {...this.state.MSFTData, low: low} })
        this.setState({ MSFTData: {...this.state.MSFTData, close: close} })
        this.setState({ MSFTData: {...this.state.MSFTData, volume: volume} })
      })
      .catch(error => {
        console.log('parsing failed: ', error)
      })
  }

  render() {
    const { stocks } = this.props
    return (
        <div className="stocks">
        <p>microsoft Data: </p>
        <p>symbol: {this.state.MSFTData.symbol}</p>
        <p>open: {this.state.MSFTData.open}</p>
        <p>high: {this.state.MSFTData.high}</p>
        <p>low: {this.state.MSFTData.low}</p>
        <p>close: {this.state.MSFTData.close}</p>
        <p>volume: {this.state.MSFTData.volume}</p>
        {stocks.map((stock, i) =>
            <Stock key={i} stock={stock}/>
        )}
        {/* <BarChart className="barChart" size={[500, 500]} data={serializeProps(stocks, "vwap")} /> */}
        Line chart: <LineChart className="lineChart" data={this.state.data} />
      </div>
    )
  }
}

export default StockDashboard;
