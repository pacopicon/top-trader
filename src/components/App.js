import React, { Component } from 'react'
// import classnames from 'classnames'
import { render } from 'react-dom'
import Nav from './Nav'
import Traders from './Traders'
import Trades from './Trades'
import BarChart from './BarChart'
import StockDashboard from './StockDashboard'
import { tradeData } from '../JSONdata'
import '../styles/App.css'
import { getTraderScore } from '../helpers';


class App extends Component {
  constructor() {
    super()
    this.handleLinkToggle = this.handleLinkToggle.bind(this)
    this.state = {
      tradesLinkClicked: false
    }
  }

  handleLinkToggle(boolean) {
    this.setState({
      tradesLinkClicked: boolean
    });
  }

  render() {
    if (this.state.tradesLinkClicked) {
      return (
        <div className="App">

          <Nav
            linkClicked={this.state.tradesLinkClicked}
            handleLinkToggle={this.handleLinkToggle}
          />

          {/* <div className="App-header">
            <p>Top Trader</p>
            <button className="linkBtn" aria-hidden="true" name="tradesLinkClicked" value={tradesLinkClicked} onClick={(e) => this.handleLinkToggle(e, false)}></button>
          </div> */}

          <div className="traders">
            <Traders traders={tradeData.traders} trades={tradeData.trades} stocks={tradeData.stocks}/>
          </div>
        </div>
      );
    } else if (!this.state.tradesLinkClicked) {
      return (
        <div className="App">

          <Nav
            linkClicked={this.state.tradesLinkClicked}
            handleLinkToggle={this.handleLinkToggle}
          />

          {/* <div className="App-header">
            <p>Stocks</p>
            <button className="linkBtn" aria-hidden="true" name="tradesLinkClicked" value={tradesLinkClicked} onClick={(e) => this.handleLinkToggle(e, true)}></button>
          </div> */}

          <div className="stockDashboard">
            <StockDashboard />
            {/* <BarChart size={[500, 500]} data={[5, 10, 1, 3]} /> */}
          </div>
        </div>
      );
    }

  }
}

export default App;
