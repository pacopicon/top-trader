import React, { Component } from 'react';
import { render } from 'react-dom';
import Traders from './Traders'
import Trades from './Trades'
import { tradeData } from './JSONdata';
import './App.css';

class App extends Component {
  render() {
    console.log('tradeData = ', tradeData)
    return (
      <div className="App">
        <div className="App-header">
          <p>Top Trader</p>
        </div>
        <div className="Body">
          <Traders traders={tradeData.traders} trades={tradeData.trades} stocks={tradeData.stocks}/>
        </div>
      </div>
    );
  }
}

export default App;
