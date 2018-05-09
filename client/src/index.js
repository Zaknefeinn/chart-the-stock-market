import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryAxis,
  VictoryGroup
} from 'victory';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    axios.get('/api/test').then(res => {
      this.setState({ data: res.data['Time Series (Daily)'] });
    });
  }
  render() {
    let dataArr = [];
    const data = this.state.data;
    for (const prop1 in data) {
      dataArr.push({ date: [prop1], usd: data[prop1]['2. high'] });
    }
    dataArr = dataArr.map(x => {
      return { x: new Date(x.date[0]), y: parseInt(x.usd) };
    });
    console.log(dataArr);
    return (
      <div>
        <VictoryChart
          width={800}
          height={800}
          scale={{ x: 'time' }}
          containerComponent={<VictoryVoronoiContainer labels={d => d.y} />}
        >
          <VictoryAxis />
          <VictoryAxis dependentAxis tickValues={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]} />
          <VictoryLine data={dataArr} />
        </VictoryChart>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
