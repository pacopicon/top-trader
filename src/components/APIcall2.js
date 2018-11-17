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

// API IntraDay can be imperfect, and some minutes are left out, need to check that previous trading day time isn't included
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

const parseData = (json, timeScale) => {

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
    return {
      datePrice, 
      latestData, 
      data
    }
  
}

const iterateAndParseData = (symbol, checkIfItsFetching, callback) => {
  checkIfItsFetching(true)

  let 
    timeScales = [1, 8, 32, 94, 187, 366, 731],
    data = [],
    datum = ''

  for (let i=0; i<timeScales.length; i++) {
    datum = callAndStoreData(timeScales[i], symbol)
    data.push(datum)
  }

  callback(data)
  checkIfItsFetching(false)
}

const callAndStoreData = (timeScale, symbol) => {
  if (!window.sessionStorage.symbol || window.sessionStorage.symbol != symbol) {
    let http = ''

    window.sessionStorage.clear()

    if (timeScale === 1) {
      http = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    } else {
      http = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=5JSEEXSISXT9VKNO`
    }

    fetch(http)
    .then(response => {
      return response.json()
    })
    .then(json => {
      console.log('callDatePriceAPI json parsing SUCCEEDED!!!')
      window.sessionStorage.symbol = symbol
      window.sessionStorage[`${timeScale}_${}`] = json
      let datum = parseData(json, timeScale)
      return datum
      
    })
    .catch(err => {
      console.log('Error pulling data from API: ', err)
    })
  } else {
    let 
      json  = window.sessionStorage[timeScale.toString()],
      datum = parseData(json, timeScale)
    return datum
  }
}

export default callAndStoreData