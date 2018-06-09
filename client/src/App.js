import React, { Component } from 'react';
import axios from 'axios';
import Chart from './components/Chart';
import Searchbar from './components/Searchbar';
import Card from './components/Card';
import './main.css';
import socketIOClient from 'socket.io-client';
import {
  TranslateDataPoints,
  TranslateMetaData
} from './components/utils/TranslateData';
import { AddCard, RemoveCard } from './components/utils/Socket.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSet: [],
      endpoint:
        'https://thawing-plateau-12593.herokuapp.com' || 'http://localhost:5000'
    };
  }
  componentDidMount() {
    const socket = socketIOClient(this.state.endpoint);
    axios.get('/api/pull').then(res => {
      //Clean up api response
      let dataSet = [];
      res.data.forEach(data => {
        const rawDataPoints = data['Time Series (Daily)'];
        const rawMetaData = data['Meta Data'];
        dataSet.push({
          symbol: TranslateMetaData(rawMetaData),
          dataPoints: TranslateDataPoints(rawDataPoints)
        });
      });
      this.setState({ dataSet });
    });
    // Live Add Card
    socket.on('add symbol', sym => {
      this.setState({
        dataSet: [...this.state.dataSet, AddCard(sym)]
      });
    });

    //Live Delete Card
    socket.on('remove symbol', sym => {
      this.setState({
        dataSet: RemoveCard(sym, this.state.dataSet)
      });
    });
  }

  handleDelete(e) {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('remove symbol', e);
  }

  handleSubmit = e => {
    const socket = socketIOClient(this.state.endpoint);
    // If there are less than 4 stocks, add a new one
    if (this.state.dataSet.length < 4) {
      socket.emit('add symbol', e);
    } else {
      alert('You may only show 4 at a time!');
    }
    // this.forceUpdate();
  };

  render() {
    const { dataSet } = this.state;
    //Load Cards
    const cardData = dataSet.map(stock => {
      //Get first object key to obtain today's data
      const today = Object.keys(stock.dataPoints)[0];
      return (
        <Card
          key={stock.symbol}
          stats={stock.dataPoints[today]}
          delete={e => this.handleDelete(stock.symbol)}
          symbol={stock.symbol}
        />
      );
    });

    //Set Chart Data
    let dataArr = [];
    dataSet.forEach(stock => {
      let newObj = {};
      for (const prop in stock.dataPoints) {
        newObj[prop] = parseFloat(stock.dataPoints[prop].close, 10).toFixed(2);
      }
      dataArr.push({
        name: stock.symbol,
        data: newObj
      });
    });

    return (
      <div>
        <Chart data={dataArr} />
        <Searchbar
          onInputChange={this.onInputChange}
          handleSubmit={this.handleSubmit}
        />
        <div className="card-container">{cardData}</div>
      </div>
    );
  }
}

export default App;
