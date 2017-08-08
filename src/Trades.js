import React, { Component } from 'react';
import { render } from 'react-dom';
import { getVWAP } from './helpers';
import './App.css';

const Trades = ({ trades, stocks }) =>
    <div>
      {trades.map((trade, i) =>
        trade.tradeType === "Buy" ?
          <div key={i}>{trade.symbol} bought: (price: ${trade.price} - vwap: ${getVWAP(trade)}) * {trade.quantity} = {(trade.price - getVWAP(trade)) * trade.quantity}</div>
        : <div key={i}>{trade.symbol} sold: (vwap: ${getVWAP(trade)} - price: ${trade.price}) * {trade.quantity} = {(getVWAP(trade) - trade.price) * trade.quantity}</div>
      )}
    </div>

export default Trades;
