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
      dataArr: [],
      term: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  componentDidMount() {
    axios.get('/api/pull').then(res => {
      let arr = [];
      res.data.forEach(e => {
        arr.push({
          name: e['Meta Data'],
          data: e['Time Series (Daily)']
        });
      });
      this.setState({ data: arr });
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
    const data = this.state.data;
    data.forEach(x => {
      console.log(x);
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
            {dataArr1.length > 0 ? <VictoryLine data={dataArr1} /> : [null]}
            {dataArr2.length > 0 ? <VictoryLine data={dataArr2} /> : [null]}
            {dataArr3.length > 0 ? <VictoryLine data={dataArr3} /> : [null]}
            {dataArr4.length > 0 ? <VictoryLine data={dataArr4} /> : [null]}
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
