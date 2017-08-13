import React, { Component } from 'react';
import { render } from 'react-dom';
import { getVWAP, serializeProps } from '../helpers';
import '../styles/App.css';
import BarChart from './BarChart'

const Trades = ({ trades, stocks }) =>
    <div>
      {trades.map((trade, i) =>
        trade.tradeType === "Buy" ?
          <div key={i}>{trade.quantity} shares of {trade.symbol} bought at ${trade.price} with a ${getVWAP(trade)} VWAP per share.<br/>
          -->Score = (price: ${trade.price} - VWAP: ${getVWAP(trade)}) * quantity: {trade.quantity} = {(trade.price - getVWAP(trade)) * trade.quantity}</div>
        : <div key={i}>{trade.quantity} shares of {trade.symbol} sold at ${trade.price} with a ${getVWAP(trade)} VWAP per share.<br/>
        -->Score = (VWAP: ${getVWAP(trade)} - price: ${trade.price}) * quantity: {trade.quantity} = {(getVWAP(trade) - trade.price) * trade.quantity}</div>
      )}
      <BarChart size={[500, 500]} data={serializeProps(trades, "quantity")} />
    </div>

export default Trades;
