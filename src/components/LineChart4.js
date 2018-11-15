import * as React from "react";
import * as d3 from "d3";
import * as Axis from "d3-axis";
import callDatePriceAPI from './APIcall'
import { getSecuritiesInfo } from '../helpers'
import { XYFrame } from 'semiotic'

class LineChart4 extends React.Component {
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
      isFetchingAPI: false
     })
  }

  componentWillReceiveProps(nextProps) {
    let 
      oldData = this.props.data,
      newData = nextProps.data,
      oldFetch = this.props.isFetchingAPI,
      newFetch = nextProps.isFetchingAPI

    if (oldData != newData) {
      let { 
        data,
        NUMERIC,
        TEXT
      } = this.props
  
      this.setState({
        data,
        NUMERIC,
        TEXT
      })
    }

    if (oldFetch != newFetch) {
      this.setState({
        isFetchingAPI: newFetch
      })
    }
  }

  componentDidMount() {
    let { 
      data,
      NUMERIC,
      TEXT,
      isFetchingAPI
    } = this.props

    this.setState({
      data,
      NUMERIC,
      TEXT,
      isFetchingAPI
    })
  }

  componentDidUpdate() {
  }

  render() {
    let {
          data,
          NUMERIC,
          TEXT,
          isFetchingAPI
        } = this.state;

    return (
      <div style={{backgroundColor: 'white'}}>
        {
          data.length>0 
          ? <XYFrame
              title={ `Meek's XYFrame` }
              points={data}
              size={ [500,500] }
              pointStyle={{ fill: "blue" }}
              xAccessor={d => d.date}
              yAccessor={d => d.price}
              xScaleType={ d3.scaleTime() }
              yScaleType={ d3.scaleLinear() }
            />
          : null
        }
        <div className="select">
          <form>
            {
              this.props.securities && !isFetchingAPI
                ? this.props.renderSecuritiesOptions()
                : <div>waiting on Data</div> 
            }
            { !isFetchingAPI
              ? this.props.renderTimeOptions() 
              : ''
            }
          </form>
        </div>
      </div>
    );
  }
}

export default LineChart4
