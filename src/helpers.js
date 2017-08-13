import { tradeData } from './JSONdata';

export const getTraderScore = (trader, trades, stocks) => {
  var tradesArr = []
  var stocksArr = []
  var score = 0

  for (var a=0; a<trades.length; a++) {
    if (trades[a].traderID === trader.name) {
      tradesArr.push(trades[a])
      for (var b=0; b<stocks.length; b++) {
        if (stocks[b].symbol === trades[a].symbol) {
          stocksArr.push(stocks[b])
          if (trades[a].tradeType === "Buy") {
            score += (trades[a].price - stocks[b].vwap) * trades[a].quantity
          } else if (trades[a].tradeType === "Sell") {
            score += (stocks[b].vwap - trades[a].price) * trades[a].quantity
          }
        }
      }
    }
  }
  return {
    score: score,
    trades: tradesArr,
    stocks: stocksArr
  }
}

export const getVWAP = (trade) => {
  const stocks = tradeData.stocks
  for (var b=0; b<stocks.length; b++) {
    if (stocks[b].symbol === trade.symbol) {
      console.log("stocks[b].vwap = " + stocks[b].vwap)
      return stocks[b].vwap
    }
  }
}

export const serializeProps = (arrayOfObjects, property) => {
  const arrayOfProps = []

  arrayOfObjects.map((obj) => arrayOfProps.push(obj[property]))
  return arrayOfProps
}
