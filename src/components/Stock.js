import React, { Component } from 'react';
import { render } from 'react-dom';
import '../styles/Stocks.css';

const Stock = ({ stock }) =>
  <div className="stock">
    <p>{stock.symbol}: ${stock.vwap}</p><br/><br/>
  </div>

export default Stock;
