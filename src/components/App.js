import React, { Component } from 'react'
import { render } from 'react-dom'
import Traders from './Traders'
import Trades from './Trades'
import BarChart from './BarChart'
import StockDashboard from './StockDashboard'
import { tradeData } from '../JSONdata'
import '../styles/App.css'
import { getTraderScore } from '../helpers';


class App extends Component {


  render() {
    console.log('tradeData = ', tradeData)
    return (
      <div className="App">
        <div className="App-header">
          <p>Top Trader</p>
        </div>
        <div className="Body">
          <StockDashboard stocks={tradeData.stocks}/>
          {/* <BarChart size={[500, 500]} data={[5, 10, 1, 3]} /> */}
          <Traders traders={tradeData.traders} trades={tradeData.trades} stocks={tradeData.stocks}/>
        </div>
      </div>
    );
  }
}

export default App;
