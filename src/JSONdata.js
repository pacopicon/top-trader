import { microsoft } from './ApiCalls';

// function generateSymbol() {
//   const company = ['AAPL', 'GOOG', 'MSFT', 'ORCL', 'TSM', 'INTC', 'CSCO', 'IBM', 'SAP', 'NVDA', 'QCOM', 'CRM', 'BIDU', 'AABA', 'ADP', 'TCEHY', 'FB', 'KS', 'WDAY']
//   return company[Math.floor(Math.random() * 10)]
// }

function generateSymbol() {
  const company = ['AAPL', 'GOOG', 'MSFT', 'ORCL', 'TSM']
  return company[Math.floor(Math.random() * 5)]
}

function generatePrice() {
  return Math.round(Math.random() * 501)
}

function generateID() {
  return Math.floor(Math.random() * 200000000000000000000).toString(16)
}

function generateName() {
  const names= ['Aziz', 'Bob', 'Christine', 'Dagmar']
  return names[Math.floor(Math.random() * 4)]
}

function chooseTradeType() {
  const tradeTypes = ['Buy', 'Sell']
  return tradeTypes[Math.floor(Math.random() * 2)]
}

function generateQuantity() {
  return Math.floor(Math.random() * 101)
}

var Aziz = class Trader {
  constructor() {
    this.name = "Aziz",
    this.id = generateID(),
    this.score = 0
  }
}

var Bob = class Trader {
  constructor() {
    this.name = "Bob",
    this.id = generateID(),
    this.score = 0
  }
}

var Christine = class Trader {
  constructor() {
    this.name = "Christine",
    this.id = generateID(),
    this.score = 0
  }
}

var Dagmar = class Trader {
  constructor() {
    this.name = "Dagmar",
    this.id = generateID(),
    this.score = 0
  }
}

// var Trader = class Trader {
//   constructor() {
//     this.name = generateName(),
//     this.id = generateID(),
//     this.score = 0
//   }
// }

var Trade = class Trade {
  constructor() {
    this.id = generateID(),
    this.traderID = generateName(),
    this.tradeType = chooseTradeType(),
    this.symbol = generateSymbol(),
    this.price = generatePrice(),
    this.quantity = generateQuantity()
  }
}

// var Stock = class Stock {
//   constructor() {
//     this.id = generateID(),
//     this.symbol = generateSymbol(),
//     this.vwap = generatePrice()
//   }
// }

var GOOG = class Stock {
  constructor() {
    this.id = generateID(),
    this.symbol = 'GOOG',
    this.vwap = generatePrice()
  }
}

var AAPL = class Stock {
  constructor() {
    this.id = generateID(),
    this.symbol = 'AAPL',
    this.vwap = generatePrice()
  }
}

var MSFT = class Stock {
  constructor() {
    this.id = generateID(),
    this.symbol = 'MSFT',
    this.vwap = generatePrice()
  }
}

var ORCL = class Stock {
  constructor() {
    this.id = generateID(),
    this.symbol = 'ORCL',
    this.vwap = generatePrice()
  }
}

var TSM = class Stock {
  constructor() {
    this.id = generateID(),
    this.symbol = 'TSM',
    this.vwap = generatePrice()
  }
}

// function fillTraders() {
//   const traders = []
//   for(var i=0; i<4; i++){
//     traders.push(new Trader)
//   }
//   return traders
// }

function fillTraders() {
  const traders = []
  traders.push(new Aziz)
  traders.push(new Bob)
  traders.push(new Christine)
  traders.push(new Dagmar)
  return traders
}

// function fillStocks() {
//   const stocks = []
//   for(var i=0; i<20; i++){
//     stocks.push(new Stock)
//   }
//   return stocks;
// }

function fillStocks() {
  const stocks = []
  stocks.push(new AAPL)
  stocks.push(new GOOG)
  stocks.push(new MSFT)
  stocks.push(new ORCL)
  stocks.push(new TSM)
  return stocks
}

function fillTrades() {
  const trades = []
  for(var i=0; i<20; i++){
    trades.push(new Trade)
  }
  return trades
}

export const tradeData = {
  "traders": fillTraders(),
   "stocks": fillStocks(),
   "trades": fillTrades()
}

// export const mcrsft = {
//   symbol: microsoft["Meta Data"]["2. Symbol"]
// }
