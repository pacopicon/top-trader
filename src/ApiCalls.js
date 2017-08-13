// import 'whatwg-fetch'
//
// export var microsoft = fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=5JSEEXSISXT9VKNO')
//   .then(response => {
//     return response.json()
//     console.log('response.json(): ', response.json())
//   })
//   .then(json => {
//     console.log('parsed json: ', json)
//   })
//   .catch(error => {
//     console.log('parsing failed: ', error)
//   })

// var microsoft = {}
//
// fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=5JSEEXSISXT9VKNO')
//   .then(response => {
//     return response.json()
//   })
//   .then(json => {
//     console.log('parsed json: ', json)
//     var microsoft = json;
//   })
//   .catch(error => {
//     console.log('parsing failed: ', error)
//   })
//
// export var microsoft
