import React, { Component } from 'react';
import { render } from 'react-dom';
import '../styles/Stocks.css';

const Stock = ({ TEXT, NUMERIC }) =>
  <div className="stock">
    <h1><p>{TEXT[0]} ({TEXT[1]}) <small>description: {TEXT[2]}</small></p></h1>

    <h2><p>Last Data</p></h2>
    <h3>latest date: {NUMERIC.date}</h3>
    <h3>open: ${NUMERIC.open}</h3>
    <h3>high: ${NUMERIC.high}</h3>
    <h3>low: ${NUMERIC.low}</h3>
    <h3>close: ${NUMERIC.close}</h3>
    <h3>volume: {NUMERIC.volume}</h3>
  </div>

export default Stock;
