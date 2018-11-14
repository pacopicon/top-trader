import * as React from "react";
import * as d3 from "d3";
import * as Axis from "d3-axis";

class LineChart2 extends React.Component {
  constructor() {
    super();

    this.state = {
      data: []
    };
  }

  componentDidMount() {
    fetch(
      "https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=60&aggregate=3&e=CCCAGG"
    )
      .then(res => res.json())
      .then(res =>
        this.setState({
          data: res.Data
        })
      );
  }

  componentDidUpdate() {
    let line = d3.selectAll("#line");
    var totalLength = line.node().getTotalLength();
    console.log(totalLength);
    line
      .attr("stroke-dasharray", totalLength)
      .attr("stroke-dashoffset", totalLength)
      .attr("stroke-width", 6)
      .attr("stroke", "#6788ad")
      .transition()
      .duration(3000)
      .attr("stroke-width", 0)
      .attr("stroke-dashoffset", 0);

    let area = d3.selectAll("#area");

    area
      .attr("transform", "translate(0, 300)")
      .transition()
      .duration(3000)
      .attr("transform", "translate(0,0)");
  }

  render() {
    let { data } = this.state;

    const height = 300;
    const width = 500;

    const boxStyles = {
      width: width,
      height: height,
      borderRadius: 5,
      margin: "0 auto"
    };

    const minX = d3.min(data.map(o => o.time));
    const maxX = d3.max(data.map(o => o.time));
    const minY = d3.min(data.map(o => o.close));
    const maxY = d3.max(data.map(o => o.close));

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
        return x(d.time);
      })
      .y(function(d) {
        return y(d.close);
      });

    var area = d3
      .area()
      .x(function(d) {
        return x(d.time);
      })
      .y0(function(d) {
        return maxY;
      })
      .y1(function(d) {
        return y(d.close);
      });

    return (
      <div style={boxStyles}>
        <svg height={height} width={width}>
          <defs>
            <linearGradient id="MyGradient">
              <stop offset="-10%" stop-color="#3b83d4" />
              <stop offset="95%" stop-color="#6788ad" />
            </linearGradient>
          </defs>

          <g id={"xAxis"}>
            <path
              id={"line"}
              d={line(data)}
              fill={"transparent"}
              stroke={"transparent"}
            />
            <path
              id={"area"}
              d={area(data)}
              fill={"url(#MyGradient)"}
              style={{ opacity: 0.8 }}
            />
          </g>
        </svg>
      </div>
    );
  }
}

export default LineChart2
