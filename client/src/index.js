import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { VictoryChart, VictoryLine, createContainer } from 'victory';
import Searchbar from './searchbar';
import './main.css';

const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      term: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  componentDidMount() {
    axios.get('/api/pull').then(res => {
      this.setState({
        data: {
          name: res.data['Meta Data'],
          data: res.data['Time Series (Daily)']
        }
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
    let dataArr = [];
    const data = this.state.data.data;
    for (const prop1 in data) {
      dataArr.push({ date: [prop1], usd: data[prop1]['2. high'] });
    }
    dataArr = dataArr.map(x => {
      return { x: new Date(x.date[0]), y: parseInt(x.usd, 10) };
    });
    // dataArr.push({ x: new Date('2018-05-09'), y: 216 });
    return (
      <div>
        <div className="container">
          <VictoryChart
            scale={{ x: 'time', y: 'linear' }}
            width={1600}
            height={700}
            containerComponent={
              <VictoryZoomVoronoiContainer labels={d => `$${d.y}`} />
            }
          >
            <VictoryLine data={dataArr} />
          </VictoryChart>
        </div>
        <Searchbar
          onInputChange={this.onInputChange}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
