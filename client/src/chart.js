import React, { Component } from 'react';
import ReactChartKick, { LineChart } from 'react-chartkick';
import Chart from 'highcharts';

ReactChartKick.addAdapter(Chart);
export default class componentName extends Component {
  render() {
    return (
      <div className="chart-container">
        <LineChart
          colors={['#FF0000', '#FFFA6A', '#2AFF00', '#00B9FF']}
          data={this.props.data}
          prefix="$"
          curve={false}
          library={{
            plotOptions: { line: { marker: { enabled: false } } },
            discrete: true,
            chart: {
              zoomType: 'xy',
              backgroundColor: 'rgba(115, 115, 115, 0.7)',
              selectionMarkerFill: 'rgba(224, 85, 2, .5)'
            },
            title: {
              text: 'Chart the Stock Market',
              style: {
                color: 'white'
              }
            },
            xAxis: {
              labels: {
                style: {
                  color: 'white'
                }
              }
            },
            yAxis: {
              labels: {
                style: {
                  color: 'white'
                }
              }
            },
            legend: {
              itemStyle: {
                color: 'white'
              }
            }
          }}
        />
      </div>
    );
  }
}
