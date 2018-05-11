import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  VictoryChart,
  VictoryLine,
  createContainer,
  VictoryTheme,
  VictoryAxis
} from 'victory';
import Searchbar from './searchbar';
import Card from './card';
import './main.css';

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataArr: [],
      term: '',
      cards: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  componentDidMount() {
    axios.get('/api/pull').then(res => {
      let arr = [];
      let names = [];
      res.data.forEach(e => {
        let dailyStats;
        for (var prop in e['Time Series (Daily)']) {
          dailyStats = e['Time Series (Daily)'][prop];
          break;
        }
        names.push({
          symbol: e['Meta Data']['2. Symbol'],
          currentStats: dailyStats
        });
        arr.push({
          name: e['Meta Data'],
          data: e['Time Series (Daily)']
        });
      });
      this.setState({
        data: arr
      });
      this.setState({
        cards: names
      });
    });
  }
  onInputChange(e) {
    this.setState({ term: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    axios(`/api/search`, {
      method: 'post',
      data: { term: this.state.term }
    }).then(res => {
      console.log(res);
    });
  }

  render() {
    const cardData = this.state.cards;
    // const cards = cardData.map(x => {
    //   return <Card key={x.symbol} stats={x.stats} symbol={x.symbol} />;
    // });
    console.log(cardData);
    let dataArr = [];
    const data = this.state.data;
    data.forEach(x => {
      for (const prop1 in x.data) {
        dataArr.push({
          name: x.name['2. Symbol'],
          date: [prop1],
          usd: x.data[prop1]['2. high']
        });
      }
    });
    dataArr = dataArr.map(x => {
      return { name: x.name, x: new Date(x.date[0]), y: parseInt(x.usd, 10) };
    });
    const dataArr1 = dataArr.slice(0, 100);
    const dataArr2 = dataArr.slice(100, 200);
    const dataArr3 = dataArr.slice(200, 300);
    const dataArr4 = dataArr.slice(300, 400);

    const test = () => {
      if (dataArr.length > 0 && dataArr.length <= 100) {
        return (
          <div className="container">
            <VictoryChart
              scale={{ x: 'time', y: 'linear' }}
              width={2000}
              height={900}
              theme={VictoryTheme.material}
              containerComponent={
                <VictoryZoomVoronoiContainer labels={d => `$${d.y}`} />
              }
            >
              <VictoryAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryLine
                style={{ data: { stroke: '#14B8FF' } }}
                data={dataArr1}
              />
            </VictoryChart>
          </div>
        );
      } else if (dataArr.length > 0 && dataArr.length <= 200) {
        return (
          <div className="container">
            <VictoryChart
              scale={{ x: 'time', y: 'linear' }}
              width={2000}
              height={900}
              theme={VictoryTheme.material}
              containerComponent={
                <VictoryZoomVoronoiContainer labels={d => `$${d.y}`} />
              }
            >
              <VictoryAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryLine
                style={{ data: { stroke: '#14B8FF' } }}
                data={dataArr1}
              />
              <VictoryLine
                style={{ data: { stroke: '#DD1347' } }}
                data={dataArr2}
              />
            </VictoryChart>
          </div>
        );
      } else if (dataArr.length > 0 && dataArr.length <= 300) {
        return (
          <div className="container">
            <VictoryChart
              scale={{ x: 'time', y: 'linear' }}
              width={2000}
              height={900}
              theme={VictoryTheme.material}
              containerComponent={
                <VictoryZoomVoronoiContainer labels={d => `$${d.y}`} />
              }
            >
              <VictoryAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryLine
                style={{ data: { stroke: '#14B8FF' } }}
                data={dataArr1}
              />
              <VictoryLine
                style={{ data: { stroke: '#DD1347' } }}
                data={dataArr2}
              />
              <VictoryLine
                style={{ data: { stroke: '#5B68FF' } }}
                data={dataArr3}
              />
            </VictoryChart>
          </div>
        );
      } else {
        return (
          <div className="container">
            <VictoryChart
              scale={{ x: 'time', y: 'linear' }}
              width={2000}
              height={900}
              theme={VictoryTheme.material}
              containerComponent={
                <VictoryZoomVoronoiContainer labels={d => `$${d.y}`} />
              }
            >
              <VictoryAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  ticks: { fill: 'white' },
                  tickLabels: { fill: 'white' }
                }}
              />
              <VictoryLine
                style={{ data: { stroke: '#14B8FF' } }}
                data={dataArr1}
              />
              <VictoryLine
                style={{ data: { stroke: '#DD1347' } }}
                data={dataArr2}
              />
              <VictoryLine
                style={{ data: { stroke: '#5B68FF' } }}
                data={dataArr3}
              />
              <VictoryLine
                style={{ data: { stroke: '#3AFF46' } }}
                data={dataArr4}
              />
            </VictoryChart>
          </div>
        );
      }
    };
    return (
      <div>
        {test()}
        <Searchbar
          onInputChange={this.onInputChange}
          handleSubmit={this.handleSubmit}
        />
        <div className="card-container" />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
