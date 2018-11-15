import { timeParse, timeFormat } from 'd3-time-format'

const exposePrices = (obj) => {
  let result = [];
  for (let prop in obj) {
    let value = obj[prop];
    if (typeof value === 'object') {
      result.push(exposePrices(value)) // <- recursive call
    } else {
      result.push(value);
    }
  }
  return result;
}

const checkIntraday = (dateArray, priceArray) => {
  let 
    newDateArray = [],
    newPriceArray = []
  for (let i=0; i<dateArray.length; i++) {
    let 
      zStr = dateArray[0],
      zDay = zStr.charAt(8) + zStr.charAt(9),
      iStr = dateArray[i],
      iDay = iStr.charAt(8) + iStr.charAt(9)
    if (iDay === zDay) {
      newDateArray.push(dateArray[i])
      newPriceArray.push(priceArray[i])
    }
  }

  let newArrays = {
    dateArr: newDateArray,
    priceArr: newPriceArray
  }
  return newArrays
}

const unpack = (str) => {
  let 
    month = Number(str.charAt(5) + str.charAt(6)),
    day = Number(str.charAt(8) + str.charAt(9)),
    year = Number(str.charAt(0) + str.charAt(1) + str.charAt(2) + str.charAt(3)),
    dateInfo = {
      year: year,
      month: month - 1,
      day: day,
      date: new Date(year, month-1, day, 0, 0, 0, 0)
    }
  return dateInfo
}

const checkDate = (dateArray, priceArray, timeScale) => {
  let 
    newDateArray  = [],
    newPriceArray = [],
    z             = unpack(dateArray[0]),
    pastLimit     = new Date(z.year, z.month, z.day-timeScale, 0, 0, 0, 0)

  for (let i=0; i<dateArray.length; i++) {
    let iDate = unpack(dateArray[i]).date
    if (pastLimit <= iDate) {
      newDateArray.push(dateArray[i])
      newPriceArray.push(priceArray[i])
    }
  }

  let newArrays = {
    dateArr: newDateArray,
    priceArr: newPriceArray
  }
  return newArrays
}

const callDatePriceAPI = (timeScale, symbol, callback, checkIfItsFetching) => {
  console.log('timeScale = ', timeScale)
  checkIfItsFetching(true)
  let 
    http = '',
    ops1 = 'full',
    ops2 = 'compact'
  if (timeScale === 1) {
    http = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=${ops1}&apikey=5JSEEXSISXT9VKNO`
  } else {
    http = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${ops1}&apikey=5JSEEXSISXT9VKNO`
  }

  fetch(http)
  .then(response => {
    return response.json()
  })
  .then(json => {
    console.log('callDatePriceAPI json parsing SUCCEEDED!!!')

    // API IntraDay can be imperfect, and some minutes are left out, need to check that previous trading day time isn't included
  
    let 
      dates = timeScale === 1 ? json['Time Series (1min)'] : json['Time Series (Daily)'],
      priceArr = exposePrices(dates),
      dateArr = Object.keys(dates),
      f,
      timeString

    if (timeScale === 1) {
      f = checkIntraday(dateArr, priceArr) // f = filtered
      timeString = '%Y-%m-%d %H:%M:%S'
    } else {
      f = checkDate(dateArr, priceArr, timeScale) // f = filtered
      timeString = '%Y-%m-%d'
    }

    console.log('f = ', f)
    let 
      dataScope  = f.dateArr.length,
      dateArray  = f.dateArr,
      priceArray = f.priceArr,
      parseTime  = timeParse(timeString),
      datePrice  = [],
      lowHigh    = [],
      volArr     = []

    for (let i=0; i<dataScope; i++) {
      let dyad = {
        date: parseTime(dateArray[i]),
        price: Array.isArray(priceArray) ? Number(priceArray[i][3]) : 0
      }
      datePrice.push(dyad)
      lowHigh.push(Number(priceArray[i][1]))
      lowHigh.push(Number(priceArray[i][2]))
      volArr.push(Number(priceArray[i][4]))
    }
  
    let 
      date          = parseTime(dateArray[0]),
      formatTime    = timeFormat("%b %d, %Y at %I:%M:%S %p"),
      formattedDate = formatTime(date),
      dateStr       = formattedDate.toString(),
      alert         = parseTime(formattedDate) < new Date ? 'market is closed' : 'up to date'
    
    lowHigh.sort((a,b) => a - b)
      
    let
      highest = lowHigh[lowHigh.length-1],
      lowest = lowHigh[0]
    
    this.getSum = (total,num) => total + num
    let totalVol = volArr.reduce(this.getSum)

    let latestData = {
      date: dateStr,
      open: Number(priceArray[datePrice.length-1][0]),
      high: highest,
      low: lowest,
      close: Number(priceArray[0][3]),
      // volume: Number(priceArray[0][4]),
      totalVol: totalVol,
      alert: alert
    }

    let data = [
      Number(priceArray[datePrice.length-1][0]), highest, lowest, Number(priceArray[0][3]), totalVol ]

     // callback is an this.setState fn
     callback(datePrice, latestData, data, true)
     checkIfItsFetching(false)
  })
  .catch(error => {
    console.log('callDatePriceAPI json parsing failed: ', error)
    let 
      timeString = '%Y-%m-%d',
      formatTime = timeFormat(timeString),
      dateArray  = [formatTime(new Date), formatTime(new Date)],
      dataScope  = dateArray.length,
      parseTime  = timeParse(timeString),
      datePrice  = []

    for (let i=0; i<dataScope; i++) {
      let dyad = {
        date: parseTime(dateArray[i]),
        price: 0
      }
      datePrice.push(dyad)
    }

    let 
      dateString = (new Date).toString(),
      latestData = {
        date: dateString,
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
        nowDate: 'market is closed'
      }

    callback({ "Meta Data":{},"Time Series (Daily)":{} }, latestData, [0,0,0,0,0], true)
    checkIfItsFetching(false)
  })
}

export default callDatePriceAPI