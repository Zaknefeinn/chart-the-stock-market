import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Axios from 'axios';
class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    axios.get('/api/test').then(res => console.log(res));
  }
  render() {
    return (
      <div>
        <h1>Test</h1>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
