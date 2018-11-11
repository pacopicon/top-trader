var source = `https://www.cryptocompare.com/api/?javascript#-api-data-histohour-`

var exactHTML = `https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=USD&limit=60&aggregate=3&e=CCCAGG`

var obj = {
"Response": "Success",
"Type": 100,
"Aggregated": true,
"Data": [
{
"time": 1512561600,
"close": 12796.48,
"high": 12807.46,
"low": 12611.18,
"open": 12628.99,
"volumefrom": 16448.54,
"volumeto": 209214768.31
},
{
"time": 1512572400,
"close": 12692.55,
"high": 12801.02,
"low": 12391.12,
"open": 12800.68,
"volumefrom": 21010.21,
"volumeto": 265217759.46
},
{
"time": 1512583200,
"close": 13195.39,
"high": 13197.99,
"low": 12688.06,
"open": 12690.91,
"volumefrom": 28195.98,
"volumeto": 367831437.99
},
{
"time": 1512594000,
"close": 13749.57,
"high": 13843.2,
"low": 13114.26,
"open": 13194.53,
"volumefrom": 39267.53,
"volumeto": 530988975.88
},
{
"time": 1512604800,
"close": 13692.75,
"high": 14158.95,
"low": 13401.61,
"open": 13750.09,
"volumefrom": 41835.99,
"volumeto": 581651380.16
},
{
"time": 1512615600,
"close": 14173.55,
"high": 14243.7,
"low": 13681.3,
"open": 13692.14,
"volumefrom": 25642.67,
"volumeto": 359052594.35
},
{
"time": 1512626400,
"close": 14517.56,
"high": 14622.49,
"low": 14070.52,
"open": 14174.14,
"volumefrom": 23866.83,
"volumeto": 341498947.72
},
{
"time": 1512637200,
"close": 14235.24,
"high": 15036.8,
"low": 14133.05,
"open": 14515.86,
"volumefrom": 37133.99,
"volumeto": 551575804.33
},
{
"time": 1512648000,
"close": 15396.01,
"high": 15416.07,
"low": 14186.61,
"open": 14224.04,
"volumefrom": 34112.45,
"volumeto": 511090282.47
},
{
"time": 1512658800,
"close": 15882.55,
"high": 16775.09,
"low": 14669.37,
"open": 15388.53,
"volumefrom": 55314.21,
"volumeto": 876639377.19
},
{
"time": 1512669600,
"close": 15854.24,
"high": 16212.23,
"low": 15191.25,
"open": 15877.8,
"volumefrom": 41919.96,
"volumeto": 667402466.05
},
{
"time": 1512680400,
"close": 16850.31,
"high": 16879.26,
"low": 15833.95,
"open": 15854.43,
"volumefrom": 37283.2,
"volumeto": 621326875.2
},
{
"time": 1512691200,
"close": 16930.49,
"high": 17294.85,
"low": 16647.02,
"open": 16867.98,
"volumefrom": 40828.67,
"volumeto": 706245709.87
},
{
"time": 1512702000,
"close": 15674,
"high": 16931.94,
"low": 14508.28,
"open": 16931.94,
"volumefrom": 56253.53,
"volumeto": 894627375.8
},
{
"time": 1512712800,
"close": 15647.94,
"high": 16414.53,
"low": 15242.14,
"open": 15670.89,
"volumefrom": 35261.33,
"volumeto": 569301097.82
},
{
"time": 1512723600,
"close": 14912.17,
"high": 15724.82,
"low": 13906.1,
"open": 15642.25,
"volumefrom": 42504.63,
"volumeto": 645581050.77
},
{
"time": 1512734400,
"close": 15870.89,
"high": 15986.13,
"low": 14512.89,
"open": 14910.83,
"volumefrom": 39313.06,
"volumeto": 602049053.2
},
{
"time": 1512745200,
"close": 15013.31,
"high": 15952.99,
"low": 14956.95,
"open": 15870.55,
"volumefrom": 28757.48,
"volumeto": 447012990.05
},
{
"time": 1512756000,
"close": 15175.6,
"high": 15568.53,
"low": 14903.82,
"open": 15003.68,
"volumefrom": 21411.11,
"volumeto": 326930119.23
},
{
"time": 1512766800,
"close": 16047.61,
"high": 16165.09,
"low": 15132.3,
"open": 15176.64,
"volumefrom": 22433.72,
"volumeto": 354291946.42
},
{
"time": 1512777600,
"close": 15799.51,
"high": 16313.18,
"low": 15536.49,
"open": 16048.18,
"volumefrom": 20956.83,
"volumeto": 332419906.27
},
{
"time": 1512788400,
"close": 15269.17,
"high": 15831.29,
"low": 15118.71,
"open": 15806,
"volumefrom": 17695.53,
"volumeto": 274155003.51
},
{
"time": 1512799200,
"close": 15331.87,
"high": 15693.77,
"low": 15228.87,
"open": 15261.52,
"volumefrom": 13167.89,
"volumeto": 203629739.18
},
{
"time": 1512810000,
"close": 15111.85,
"high": 15414.36,
"low": 14688.11,
"open": 15331.88,
"volumefrom": 22326.85,
"volumeto": 333588287.18
},
{
"time": 1512820800,
"close": 15065.63,
"high": 15314.64,
"low": 14868.36,
"open": 15103.4,
"volumefrom": 15356.09,
"volumeto": 230896801.88
},
{
"time": 1512831600,
"close": 13442.91,
"high": 15057.23,
"low": 13151.47,
"open": 15057.11,
"volumefrom": 40672.1,
"volumeto": 575217925.56
},
{
"time": 1512842400,
"close": 14533.76,
"high": 14711.61,
"low": 13439.54,
"open": 13439.54,
"volumefrom": 32082.85,
"volumeto": 459246608.23
},
{
"time": 1512853200,
"close": 14843.42,
"high": 15007.85,
"low": 14312.57,
"open": 14531.16,
"volumefrom": 19724.1,
"volumeto": 290756680.92
},
{
"time": 1512864000,
"close": 13593.59,
"high": 14839.98,
"low": 13586.31,
"open": 14839.98,
"volumefrom": 28401.5,
"volumeto": 400411213.86
},
{
"time": 1512874800,
"close": 13511.8,
"high": 13773.05,
"low": 13031,
"open": 13591.52,
"volumefrom": 38459.52,
"volumeto": 515617934.32
},
{
"time": 1512885600,
"close": 13518.21,
"high": 14051.71,
"low": 13272.46,
"open": 13510.81,
"volumefrom": 19090.66,
"volumeto": 259630106.62
},
{
"time": 1512896400,
"close": 13844.23,
"high": 14128.1,
"low": 13447.12,
"open": 13535.06,
"volumefrom": 14817.93,
"volumeto": 203842506.33
},
{
"time": 1512907200,
"close": 15216.22,
"high": 15584.29,
"low": 13691.66,
"open": 13844.3,
"volumefrom": 27160.71,
"volumeto": 401819761.27
},
{
"time": 1512918000,
"close": 15418.34,
"high": 15633.73,
"low": 14853.57,
"open": 15216.28,
"volumefrom": 23059.38,
"volumeto": 353732401.61
},
{
"time": 1512928800,
"close": 15372.63,
"high": 15657.88,
"low": 15085.09,
"open": 15414.98,
"volumefrom": 15131.83,
"volumeto": 233026471.46
},
{
"time": 1512939600,
"close": 15059.6,
"high": 15783.2,
"low": 14485.29,
"open": 15373.85,
"volumefrom": 35498.83,
"volumeto": 535962911.15
},
{
"time": 1512950400,
"close": 16325.75,
"high": 16325.75,
"low": 15024.56,
"open": 15060.45,
"volumefrom": 27077.83,
"volumeto": 428229700.1
},
{
"time": 1512961200,
"close": 16279.12,
"high": 16655.12,
"low": 16020.23,
"open": 16323.65,
"volumefrom": 26502.96,
"volumeto": 434751593.14
},
{
"time": 1512972000,
"close": 16523.02,
"high": 16752.34,
"low": 16265.61,
"open": 16277.88,
"volumefrom": 17186.05,
"volumeto": 284483458.86
},
{
"time": 1512982800,
"close": 16422.77,
"high": 16716.27,
"low": 16417.89,
"open": 16522.38,
"volumefrom": 10243.7,
"volumeto": 169086793.03
},
{
"time": 1512993600,
"close": 16330.42,
"high": 16611.44,
"low": 16136.03,
"open": 16423.62,
"volumefrom": 16587.65,
"volumeto": 271583704.69
},
{
"time": 1513004400,
"close": 16375.15,
"high": 16554.3,
"low": 16311.92,
"open": 16321.62,
"volumefrom": 14085.23,
"volumeto": 231152146.62
},
{
"time": 1513015200,
"close": 17239.12,
"high": 17399.18,
"low": 16368.22,
"open": 16374.97,
"volumefrom": 26177.79,
"volumeto": 443651759.96
},
{
"time": 1513026000,
"close": 16732.47,
"high": 17276.3,
"low": 16648.85,
"open": 17239.12,
"volumefrom": 21864.4,
"volumeto": 371347136.98
},
{
"time": 1513036800,
"close": 16714.26,
"high": 16951.23,
"low": 16548.39,
"open": 16733.29,
"volumefrom": 18541.47,
"volumeto": 310439435.32
},
{
"time": 1513047600,
"close": 16553.34,
"high": 16723.13,
"low": 16254.53,
"open": 16710.45,
"volumefrom": 19387.53,
"volumeto": 318873089.83
},
{
"time": 1513058400,
"close": 16882.54,
"high": 16950.45,
"low": 16392.96,
"open": 16554.62,
"volumefrom": 13856.23,
"volumeto": 231408551.79
},
{
"time": 1513069200,
"close": 16770.5,
"high": 16977.98,
"low": 16689.17,
"open": 16879.61,
"volumefrom": 11470.79,
"volumeto": 192810250.34
},
{
"time": 1513080000,
"close": 16941.15,
"high": 17194.2,
"low": 16619.64,
"open": 16770.06,
"volumefrom": 18650.78,
"volumeto": 315367447.4
},
{
"time": 1513090800,
"close": 17176.41,
"high": 17195.64,
"low": 16818.78,
"open": 16941.76,
"volumefrom": 15342.47,
"volumeto": 261167480.6
},
{
"time": 1513101600,
"close": 17123.82,
"high": 17560.65,
"low": 17117.72,
"open": 17180.38,
"volumefrom": 19083.56,
"volumeto": 332815839.4
},
{
"time": 1513112400,
"close": 17083.9,
"high": 17356.5,
"low": 16978.84,
"open": 17124.96,
"volumefrom": 16515.52,
"volumeto": 283288809.81
},
{
"time": 1513123200,
"close": 16537.88,
"high": 17267.96,
"low": 16271.95,
"open": 17083.9,
"volumefrom": 22726.77,
"volumeto": 383364493.54
},
{
"time": 1513134000,
"close": 16829.71,
"high": 16884.29,
"low": 16365.6,
"open": 16537.88,
"volumefrom": 19012.26,
"volumeto": 315907129.45
},
{
"time": 1513144800,
"close": 16728.16,
"high": 16830.12,
"low": 16589.36,
"open": 16829.7,
"volumefrom": 11211.54,
"volumeto": 186241333.74
},
{
"time": 1513155600,
"close": 16722.75,
"high": 16804.33,
"low": 16652.92,
"open": 16728.16,
"volumefrom": 11369.3,
"volumeto": 189193054.82
},
{
"time": 1513166400,
"close": 16947.75,
"high": 17180.13,
"low": 16717.42,
"open": 16722.75,
"volumefrom": 16197.08,
"volumeto": 275433540.78
},
{
"time": 1513177200,
"close": 16381.97,
"high": 17067.69,
"low": 16232.18,
"open": 16947.75,
"volumefrom": 24930.47,
"volumeto": 413891734.99
},
{
"time": 1513188000,
"close": 16153.66,
"high": 16430.02,
"low": 15669.86,
"open": 16377.25,
"volumefrom": 32491.82,
"volumeto": 524736352.74
},
{
"time": 1513198800,
"close": 16286.82,
"high": 16667.45,
"low": 16141.25,
"open": 16153.65,
"volumefrom": 17469.94,
"volumeto": 287319478.93
},
{
"time": 1513209600,
"close": 16444.39,
"high": 16504.06,
"low": 16206.09,
"open": 16286.82,
"volumefrom": 4975.98,
"volumeto": 81429179.67
}
],
"TimeTo": 1513213200,
"TimeFrom": 1512561600,
"FirstValueInArray": true,
"ConversionType": {
"type": "direct",
"conversionSymbol": ""
}
}

// Procedure:
// 1. iterate over the "data" array value within the JSON object (above) and create a new array populated by trades spanning the last 24 hours by checking each element's time value and stopping at 24 hrs.  Use the following function:

var mod = 1000 // to convert time data, which is given in seconds

var dayAgo = function(millis) {
  var date = new Date(millis*mod)
  var y = date.getFullYear()
  var mo = date.getMonth()
  var d = date.getDate()
  var h = date.getHours()
  
  var yesterday = new Date(y,mo,d-1,h)
  var dayAgoNum = yesterday.getTime()
  return dayAgoNum / 1000
}

var yesterday = dayAgo(obj.TimeTo)

var filter24 = function(arr, yesterday) {
  var last24hrs = []
  var totalVol = 0
  var highs = []
  var vols = []
  var lows = []
  for (var i=0; i<arr.length; i++) {
    if (arr[i].time >= yesterday) {
      last24hrs.push(arr[i])
      highs.push(arr[i].high)
      lows.push(arr[i].low)
      vols.push(arr[i].volumefrom)
      totalVol += arr[i].volumefrom
    }
  }
  var last24Data = {
    last24hrs: last24hrs,  // not needed in a strict sense
    highs:highs,
    lows:lows,
    vols:vols,
    totalVol: totalVol
  }
  
  return last24Data
}

var last24Data = filter24(obj.Data, yesterday)

// 2. Calculate VWAP for the trades in the new array:
// 2.1 Derive the highest high in the last24Data set along with its associated low and volume
// 2.2 Derive the lowest low in the last24Data set along with its associated high and volume
// 2.3 Average highest high with its assoc. low and multiply by its assoc. volume
// 2.4 Average lowest low iwth its assoc. high and multiply by its assoc. volume
// 2.5 Average results of 2.3 and 2.4
// Result of 2.5 is divided by total volume:

var totalVol = last24Data.totalVol

var highs = last24Data.highs.sort()

var lows = last24Data.lows.sort()

var highest = highs[highs.length-1]

var lowest = lows[0]

var vols = last24Data.vols

var correlate = function(sortResult, unSorted, associatedArr) {
    var i = unSorted.indexOf(sortResult)
    return associatedArr[i]
}

var lowToHighest = correlate(highest,highs,lows)

var highToLowest = correlate(lowest,lows,highs)

var highVol = correlate(highest,highs,vols)

var lowVol = correlate(lowest,lows,vols)

var highestAVG = (highest + lowToHighest)/2

var lowestAVG = (lowest + highToLowest)/2

var highestTimesVol = highestAVG * highVol

var lowestTimesVol = lowestAVG * lowVol

var VWAP = (highestTimesVol + lowestTimesVol/2)/totalVol

// the Full formula for our VWAP calculation is:

//              (((highest high + its low)/2 * its vol) + ((lowest low + its high)/2) * its vol) / 2
// var VWAP =  ------------------------------------------------------------------------------------
//                                                  total vol

// 3. Should we cache the API data requests?
// 3.1 We should probably cache the Pulling of hourly trades from several exchanges for the past 24 hours.
// 3.2 This "probably" becomes more and more a "definitely" if we want to widen the time frame in which we calculate a VWAP




