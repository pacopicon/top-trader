import React, { Component } from 'react';
import { render } from 'react-dom';
import Trades from './Trades';
import { getTraderScore } from './helpers';
import './App.css';

const Traders = ({ traders, trades, stocks }) =>
    <div className="traders col-xs-6-">
      <p>traders:</p>
      {traders.map((trader, i) =>
        <div key={i}>
          <div className="trades">
            <div>{trader.name}'s trades:
              <Trades trades={getTraderScore(trader, trades, stocks).trades} stocks={getTraderScore(trader, trades, stocks).stocks}/>
            </div>
          </div>
          <p className="score">-->{trader.name}'s total score: {getTraderScore(trader, trades, stocks).score}</p>
        </div>
      )}
    </div>

export default Traders;
