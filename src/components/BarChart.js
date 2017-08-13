import React, { Component } from 'react'
import '../styles/App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

class BarChart extends Component {
   constructor(props){
      super(props)
      this.createBarChart = this.createBarChart.bind(this)
   }

   componentDidMount() {
      this.createBarChart()
   }

   componentDidUpdate() {
      this.createBarChart()
   }

   createBarChart() {
      const node = this.node
      const dataMax = max(this.props.data)
      const yScale = scaleLinear()
         .domain([0, dataMax])
         .range([0, this.props.size[1]])

     select(node)
        .selectAll('rect')
        .data(this.props.data)
        .enter()
        .append('rect')

     select(node)
        .selectAll('rect')
        .data(this.props.data)
        .exit()
        .remove()

     select(node)
        .selectAll('rect')
        .data(this.props.data)
        .style('fill', 'aquamarine')
        .attr('x', (d,i) => i * 26) // width of the container of the specific bar (helps modulate distance b/t bars)
        .attr('y', d => this.props.size[1] - yScale(d)) // height of the entire chart
        .attr('height', d => yScale(d)) // height of the actual bar
        .attr('width', 25) // width of the actual bar
   }

render() {
      return <svg ref={node => this.node = node}
      width={500} height={500}>
      </svg>
   }
}
export default BarChart
