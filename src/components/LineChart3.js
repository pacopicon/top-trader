import * as React from "react";
import * as d3 from "d3";
import * as Axis from "d3-axis";
import callDatePriceAPI from './APIcall'
import { getSecuritiesInfo } from '../helpers'

class LineChart3 extends React.Component {
  constructor() {
    super();

    this.state = {
      totalLength: '',
      securities: getSecuritiesInfo(),
      security: 'MMM',
      timeScales: {'1D':1, '1W':8, '1M':32, '3M':(94), '6M':(187), '1Y':(366), '2Y':(731)},
      timeScale: '',
      // timeScale: 1,
      // TEXT: ['MMM','3M Company', 'Industrials'],
      // TEXT: ['MMM','3M Company', 'Industrials'],
      TEXT: '',
      NUMERIC: [new Date(), 0, 0, 0, 0, 0, 0],
      data: [0,0,0,0,0],
      GRAPHIC: { "Meta Data":{},"Time Series (Daily)":{} },
      data: []
    };
    this.updateData = this.updateData.bind(this)
  }

  updateData(datePrice, latestData, data, boolean) {
    this.setState({
      data: datePrice,
      NUMERIC: latestData,
      data1: data,
      isFinDataHere: boolean
     })
  }

  componentWillReceiveProps(nextProps) {
    let 
      oldData = this.props.data,
      newData = nextProps.data
    
    if (oldData != newData) {
      let { 
        data,
        NUMERIC,
        TEXT
      } = nextProps

      this.setState({
        data,
        NUMERIC,
        TEXT
      }, () => {

        let line = d3.selectAll("#line");
        var totalLength = line.node().getTotalLength();
        console.log(totalLength);
        line
          .attr("stroke-dasharray", totalLength)
          .attr("stroke-dashoffset", totalLength)
          .attr("stroke-width", 6)
          .attr("stroke", "#6788ad")
          .transition()
          .duration(1000)
          .ease(d3.easeLinear)
          .attr("stroke-width", 0)
          .attr("stroke-dashoffset", 0);

      })
      
    }
  }

  componentDidMount() {
    // fetch(
    //   "https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=60&aggregate=3&e=CCCAGG"
    // )
    //   .then(res => res.json())
    //   .then(res =>
    //     this.setState({
    //       data: res.Data
    //     })
    //   );

    // (0) This also works!!!!
    let { 
          data,
          NUMERIC,
          TEXT
        } = this.props

    this.setState({
      data,
      NUMERIC,
      TEXT
    }, () => {

      let line = d3.selectAll("#line");
      var totalLength = line.node().getTotalLength();
      console.log(totalLength);
      line
        .attr("stroke-dasharray", totalLength)
        .attr("stroke-dashoffset", totalLength)
        .attr("stroke-width", 6)
        .attr("stroke", "#6788ad")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-width", 0)
        .attr("stroke-dashoffset", 0);

    })

    // Both methods below work fine:

    // (1)
    // this.setState({
    //   TEXT: ['MMM','3M Company', 'Industrials'],
    //   timeScale: 1
    // }, () => {
    //   callDatePriceAPI(this.state.timeScale, this.state.TEXT[0], this.updateData)
    // })

    // (2)
    // callDatePriceAPI(this.state.timeScale, this.state.TEXT[0], this.updateData)
  }

  componentDidUpdate() {
    // let line = d3.selectAll("#line");
    // var totalLength = line.node().getTotalLength();
    // console.log(totalLength);
    // line
    //   .attr("stroke-dasharray", totalLength)
    //   .attr("stroke-dashoffset", totalLength)
    //   .attr("stroke-width", 6)
    //   .attr("stroke", "#6788ad")
    //   .transition()
    //   .duration(1000)
    //   .ease(d3.easeLinear)
    //   .attr("stroke-width", 0)
    //   .attr("stroke-dashoffset", 0);

    // let area = d3.selectAll("#area");

    // area
    //   .attr("transform", "translate(0, 300)")
    //   .transition()
    //   .duration(3000)
    //   .attr("transform", "translate(0,0)");
  }

  render() {
    let {
          data,
          NUMERIC,
          TEXT
        } = this.state;

    const height = 300;
    const width = 500;

    const boxStyles = {
      width: width,
      height: height,
      borderRadius: 5,
      margin: "0 auto"
    };

    const minX = d3.min(data.map(o => o.date));
    const maxX = d3.max(data.map(o => o.date));
    const minY = d3.min(data.map(o => o.price));
    const maxY = d3.max(data.map(o => o.price));

    let x = d3
      .scaleLinear()
      .domain([minX, maxX])
      .range([0, width]);

    let y = d3
      .scaleLinear()
      .domain([minY, maxY])
      .range([height, height / 3]);

    var line = d3
      .line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.price);
      });

    // var area = d3
    //   .area()
    //   .x(function(d) {
    //     return x(d.date);
    //   })
    //   .y0(function(d) {
    //     return maxY;
    //   })
    //   .y1(function(d) {
    //     return y(d.price);
    //   });

    return (
      <div style={boxStyles}>

        {/*<div className="stockInfo">
          <h1><p>{TEXT[0]} ({TEXT[1]}) <small>sector: {TEXT[2]}</small></p></h1>
          <div className="rightInfo col-xs-6">
            <h3>open: ${NUMERIC.open}</h3>
            <h3>high: ${NUMERIC.high}</h3>
            <h3>low: ${NUMERIC.low}</h3>
          </div>
          <div className="leftInfo col-xs-6">
            <h3>close: ${NUMERIC.close}</h3>
            <h3>volume: {NUMERIC.totalVol}</h3>
            <small>last update: {NUMERIC.date} ({NUMERIC.alert})</small>
          </div>
        </div>*/}

        <svg height={height} width={width}>
          <defs>
            <linearGradient id="MyGradient">
              <stop offset="-10%" stopColor="#3b83d4" />
              <stop offset="95%" stopColor="#6788ad" />
            </linearGradient>
          </defs>

          <g id={"xAxis"}>
            <path
              id={"line"}
              d={line(data)}
              fill={"transparent"}
              stroke={"transparent"}
            />
            {/* <path
              id={"area"}
              d={area(data)}
              fill={"url(#MyGradient)"}
              style={{ opacity: 0.8 }}
            /> */}
          </g>
        </svg>
        <div className="select">
          <form>
            {
              this.props.securities 
                ? this.props.renderSecuritiesOptions()
                : <div>waiting on Data</div> 
            }
            { this.props.renderTimeOptions() }
          </form>
        </div>
      </div>
    );
  }
}

export default LineChart3
