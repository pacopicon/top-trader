import React, { Component } from 'react';
import { render } from 'react-dom';
import '../styles/Stocks.css';
import BarChart from './BarChart'
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
      },
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
        // CAN'T DO THIS THOUGH: this.setState( { MSFTData.symbol: json['Meta Data']['2. Symbol'] } )
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
        <BarChart className="barChart" size={[500, 500]} data={serializeProps(stocks, "vwap")} />
      </div>
    )
  }
}

export default StockDashboard;
