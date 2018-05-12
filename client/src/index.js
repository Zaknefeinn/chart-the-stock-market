import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import {
//   VictoryChart,
//   VictoryLine,
//   createContainer,
//   VictoryTheme,
//   VictoryAxis
// } from 'victory';
import Chart from './chart';
import Searchbar from './searchbar';
import Card from './card';
import './main.css';
import socketIOClient from 'socket.io-client';

// const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');
// function updateData() {
//   const socket = socketIOClient('http://localhost:5000');
//   socket.on('add symbol', sym => {
//     const newSym = {
//       name: sym['Meta Data'],
//       data: sym['Time Series (Daily)']
//     };
//     // this.setState({ data: [...this.state.data, newSym] });
//   });
// }
class App extends Component {
  constructor(props) {
    super(props);
    // updateData();
    this.state = {
      data: [],
      dataArr: [],
      term: '',
      cards: [],
      endpoint: 'http://localhost:5000'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }
  componentDidMount() {
    axios.get('/api/pull').then(res => {
      console.log(res);
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
    //Live Add Card
    const socket = socketIOClient(this.state.endpoint);
    socket.on('add symbol', sym => {
      const newSym = {
        name: sym['Meta Data'],
        data: sym['Time Series (Daily)']
      };
      let currentStats;
      for (var prop in sym['Time Series (Daily)']) {
        currentStats = sym['Time Series (Daily)'][prop];
        break;
      }
      const newCard = {
        symbol: sym['Meta Data']['2. Symbol'],
        currentStats: currentStats
      };
      this.setState({
        data: [...this.state.data, newSym],
        cards: [...this.state.cards, newCard]
      });
    });

    //Live Delete Card
    socket.on('remove symbol', sym => {
      const cardData = this.state.cards;
      const data = this.state.data;
      let newSymbols = [];
      let newData = [];
      sym.forEach(s => {
        newSymbols.push(cardData.filter(x => x.symbol === s)[0]);
        newData.push(data.filter(x => x.name['2. Symbol'] === s)[0]);
      });
      this.setState({
        data: newData,
        cards: newSymbols
      });
    });
  }

  handleDelete(e) {
    const socket = socketIOClient(this.state.endpoint);
    // axios.put(`/api/${e}`);
    socket.emit('remove symbol', e);
  }
  onInputChange(e) {
    this.setState({ term: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.data.length < 4) {
      const socket = socketIOClient(this.state.endpoint);
      socket.emit('add symbol', this.state.term);
    } else {
      console.log('too many datapoints');
    }
    this.setState({ term: '' });
  }

  render() {
    const cardData = this.state.cards;
    const data = this.state.data;
    const socket = socketIOClient(this.state.endpoint);
    //Load Cards
    const cards = cardData.map(x => {
      return (
        <Card
          key={x.symbol}
          stats={x.currentStats}
          delete={e => this.handleDelete(x.symbol)}
          symbol={x.symbol}
        />
      );
    });

    //Check Chart Data
    let dataArr = [];

    data.forEach(x => {
      let newObj = new Object();
      for (const prop1 in x.data) {
        newObj[prop1] = parseFloat(x.data[prop1]['4. close'], 10).toFixed(2);
      }
      dataArr.push({
        name: x.name['2. Symbol'],
        data: newObj
      });
    });

    return (
      <div>
        <Chart data={dataArr} />
        <Searchbar
          onInputChange={this.onInputChange}
          handleSubmit={this.handleSubmit}
          term={this.state.term}
        />
        <div className="card-container">{cards}</div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
