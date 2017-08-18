import React, { Component } from 'react';
import { render } from 'react-dom';
import '../styles/Stocks.css';
import BarChart from './BarChart'
import LineChart from './LineChart'
import Stock from './Stock'
import { serializeProps } from '../helpers';
// import { tradeData, mcrsft } from '../JSONdata';
// import { microsoft } from '../ApiCalls';

class StockDashboard extends Component {
  constructor() {
    super()
    this.renderLineChart = this.renderLineChart.bind(this)
    this.switchSecurity = this.switchSecurity.bind(this)
    this.destroyPrevSecurity = this.destroyPrevSecurity.bind(this)
    this.renderSecurityOptions = this.renderSecurityOptions.bind(this)
    this.handleSecuritySelection = this.handleSecuritySelection.bind(this)
    this.callAPI = this.callAPI.bind(this)
    this.state = {
      renderLineChart: true,
      MSFTData: {
        symbol: '',
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volume: 0,
      }, securities: [
        '','AAPL','ABT','ABBV','ACN','ACE','ADBE','ADT','AAP','AES','AET','AFL','AMG','A','GAS','ARE','APD','AKAM','AA','AGN','ALXN','ALLE','ADS','ALL','ALTR','MO','AMZN','AEE','AAL','AEP','AXP','AIG','AMT','AMP','ABC','AME','AMGN','APH','APC','ADI','AON','APA','AIV','AMAT','ADM','AIZ','T','ADSK','ADP','AN','AZO','AVGO','AVB','AVY','BHI','BLL','BAC','BK','BCR','BXLT','BAX','BBT','BDX','BBBY','BRK.B','BBY','BLX','HRB','BA','BWA','BXP','BSX','BMY','BRCM','BF.B','CHRW','CA','CVC','COG','CAM','CPB','COF','CAH','HSIC','KMX','CCL','CAT','CBG','CBS','CELG','CNP','CTL','CERN','CF','SCHW','CHK','CVX','CMG','CB','CI','XEC','CINF','CTAS','CSCO','C','CTXS','CLX','CME','CMS','COH','KO','CCE','CTSH','CL','CMCSA','CMA','CSC','CAG','COP','CNX','ED','STZ','GLW','COST','CCI','CSX','CMI','CVS','DHI','DHR','DRI','DVA','DE','DLPH','DAL','XRAY','DVN','DO','DTV','DFS','DISCA','DISCK','DG','DLTR','D','DOV','DOW','DPS','DTE','DD','DUK','DNB','ETFC','EMN','ETN','EBAY','ECL','EIX','EW','EA','EMC','EMR','ENDP','ESV','ETR','EOG','EQT','EFX','EQIX','EQR','ESS','EL','ES','EXC','EXPE','EXPD','ESRX','XOM','FFIV','FB','FAST','FDX','FIS','FITB','FSLR','FE','FISV','FLIR','FLS','FLR','FMC','FTI','F','FOSL','BEN','FCX','FTR','GME','GPS','GRMN','GD','GE','GGP','GIS','GM','GPC','GNW','GILD','GS','GT','GOOGL','GOOG','GWW','HAL','HBI','HOG','HAR','HRS','HIG','HAS','HCA','HCP','HCN','HP','HES','HPQ','HD','HON','HRL','HSP','HST','HCBK','HUM','HBAN','ITW','IR','INTC','ICE','IBM','IP','IPG','IFF','INTU','ISRG','IVZ','IRM','JEC','JBHT','JNJ','JCI','JOY','JPM','JNPR','KSU','K','KEY','GMCR','KMB','KIM','KMI','KLAC','KSS','KRFT','KR','LB','LLL','LH','LRCX','LM','LEG','LEN','LVLT','LUK','LLY','LNC','LLTC','LMT','L','LOW','LYB','MTB','MAC','M','MNK','MRO','MPC','MAR','MMC','MLM','MAS','MA','MAT','MKC','MCD','MCK','MJN','MMV','MDT','MRK','MET','KORS','MCHP','MU','MSFT','MHK','TAP','MDLZ','MON','MNST','MCO','MS','MOS','MSI','MUR','MYL','NDAQ','NOV','NAVI','NTAP','NFLX','NWL','NFX','NEM','NWSA','NEE','NLSN','NKE','NI','NE','NBL','JWN','NSC','NTRS','NOC','NRG','NUE','NVDA','ORLY','OXY','OMC','OKE','ORCL','OI','PCAR','PLL','PH','PDCO','PAYX','PNR','PBCT','POM','PEP','PKI','PRGO','PFE','PCG','PM','PSX','PNW','PXD','PBI','PCL','PNC','RL','PPG','PPL','PX','PCP','PCLN','PFG','PG','PGR','PLD','PRU','PEG','PSA','PHM','PVH','QRVO','PWR','QCOM','DGX','RRC','RTN','O','RHT','REGN','RF','RSG','RAI','RHI','ROK','COL','ROP','ROST','RLD','R','CRM','SNDK','SCG','SLB','SNI','STX','SEE','SRE','SHW','SPG','SWKS','SLG','SJM','SNA','SO','LUV','SWN','SE','STJ','SWK','SPLS','SBUX','HOT','STT','SRCL','SYK','STI','SYMC','SYY','TROW','TGT','TEL','TE','TGNA','THC','TDC','TSO','TXN','TXT','HSY','TRV','TMO','TIF','TWX','TWC','TJX','TMK','TSS','TSCO','RIG','TRIP','FOXA','TSN','TYC','UA','UNP','UNH','UPS','URI','UTX','UHS','UNM','URBN','VFC','VLO','VAR','VTR','VRSN','VZ','VRTX','VIAB','V','VNO','VMC','WMT','WBA','DIS','WM','WAT','ANTM','WFC','WDC','WU','WY','WHR','WFM','WMB','WEC','WYN','WYNN','XEL','XRX','XLNX','XL','XYL','YHOO','YUM','ZBH','ZION','ZTS'
      ],
      security: '',
      MSFTdailyData: { "Meta Data": {},"Time Series (Daily)": {} }
    }
  }

  callAPI() {

    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${this.state.security}&outputsize=full&apikey=5JSEEXSISXT9VKNO`)
    .then(response => {
      console.log('this.state.security = ', this.state.security);
      console.log('typeof this.state.security = ', typeof this.state.security);
      return response.json()
    })
    .then(json => {
      console.log('parsed json: ', json)
      // USUAL WAY: this.setState({ microsoft: json })
      // CAN'T DO THIS with a nested state THOUGH.  Need to do this instead:
      // this.setState( { MSFTData.symbol: json['Meta Data']['2. Symbol'] } )
      // var symbol = json['Meta Data']['2. Symbol']
      // var open = json['Time Series (Daily)']['2017-08-11']['1. open']
      // var high = json['Time Series (Daily)']['2017-08-11']['2. high']
      // var low = json['Time Series (Daily)']['2017-08-11']['3. low']
      // var close = json['Time Series (Daily)']['2017-08-11']['4. close']
      // var volume = json['Time Series (Daily)']['2017-08-11']['5. volume']
      // this.setState({ MSFTData: {...this.state.MSFTData, symbol: symbol} })
      // this.setState({ MSFTData: {...this.state.MSFTData, open: open} })
      // this.setState({ MSFTData: {...this.state.MSFTData, high: high} })
      // this.setState({ MSFTData: {...this.state.MSFTData, low: low} })
      // this.setState({ MSFTData: {...this.state.MSFTData, close: close} })
      // this.setState({ MSFTData: {...this.state.MSFTData, volume: volume} })
      this.setState({ MSFTdailyData: json })
    })
    .catch(error => {
      console.log('parsing failed: ', error)
      this.setState({ MSFTdailyData: { "Meta Data":{},"Time Series (Daily)":{} } })
    })
  }

  componentDidMount() {
    // fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=5JSEEXSISXT9VKNO')

    this.callAPI()
  }

  // componentWillUnmount() {
  //   this.callAPI() // calling this.callAPI() here and also in componentDidMount() will superinpose all security data on top of each other
  // }

  switchSecurity(choice) {

    // if (this.state.security !== '') {
    //   console.log('prev state was a security string, destroying it now');
    //   this.destroyPrevSecurity(choice)
    // } else {
    //   console.log('prev state was an empty string, assigning new one');
    //   this.setState({
    //     // renderLineChart: false,
    //     security: choice
    //   }, function onceStateIsUpdated() {
    //       console.log(`Q: Does ${choice} match ${this.state.security}? A: ${choice == this.state.security}`)
    //       console.log("this.state.renderLineChart = ", this.state.renderLineChart)
    //       if (this.state.security == choice) {
    //         console.log("callback fired")
    //         this.callAPI()
    //         this.setState({
    //           renderLineChart: true
    //         })
    //       }
    //
    //   })
    // }

    if (!this.state.renderLineChart || this.state.security == '') {
      this.setState({
        security: choice
      }, function onceStateIsUpdated() {
        console.log("first option fired")
        console.log(`this.state.renderLineChart is ${this.state.renderLineChart} and this.state.security is ${this.state.security}`)
        this.setState({
          renderLineChart: true
        })
        this.callAPI()
      })
    } else if (this.state.renderLineChart && this.state.security !== '') {
      console.log("second option fired")
      console.log(`this.state.renderLineChart is ${this.state.renderLineChart} and this.state.security is ${this.state.security}`)
      this.setState({
        security: '',
        renderLineChart: false
      }, function onceStateIsUpdated() {
        this.callAPI()
        setTimeout(() => this.switchSecurity(choice), 300)
      })
    }



  }

  destroyPrevSecurity(choice) {

    this.setState({
      security: '',
      renderLineChart: false
    }, function onceStateIsUpdated() {
      console.log("destroy called");
        this.callAPI()
    })

    // this.switchSecurity(choice)
  }

  renderLineChart() {
    return this.state.renderLineChart ? <LineChart className="lineChart"
      MSFTdailyData={this.state.MSFTdailyData}
      security={this.state.security}
      securities={this.state.securities}
      // switchSecurity={this.switchSecurity}
    /> : null
  }

  renderSecurityOptions() {
    const { securities } = this.state,

    secOption = (opt, i) => <option key={i} value={opt}>{opt}</option>

    return securities.map(secOption)

  }

  handleSecuritySelection(event) {
    console.log("event.target.value = ", event.target.value);
    this.switchSecurity(event.target.value)
  }

  render() {
    const { stocks } = this.props
    return (
        <div className="stocks">
        {/* <p>microsoft Data: </p>
        <p>symbol: {this.state.MSFTData.symbol}</p>
        <p>open: {this.state.MSFTData.open}</p>
        <p>high: {this.state.MSFTData.high}</p>
        <p>low: {this.state.MSFTData.low}</p>
        <p>close: {this.state.MSFTData.close}</p>
        <p>volume: {this.state.MSFTData.volume}</p> */}
        {stocks.map((stock, i) =>
            <Stock key={i} stock={stock}/>
        )}
        {this.renderLineChart()}
        <form>
          <select onChange={this.handleSecuritySelection}>
            {this.renderSecurityOptions()}
          </select>
        </form>
      </div>
    )
  }


}

export default StockDashboard;
