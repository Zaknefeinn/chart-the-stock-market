import React, { Component } from 'react';

export default class Card extends Component {
  render() {
    return (
      <div className="card">
        <div className="card-nav">
          <input
            id="remove"
            type="button"
            onClick={this.props.delete}
            value="X"
          />
          <h1>{this.props.symbol}</h1>
        </div>
        <div className="sub-container">
          <div className="sub sub-left">
            <h1>Open</h1>
            <h2>${parseInt(this.props.stats.open, 10)}</h2>
          </div>
          <div className="sub sub-middle">
            <h1>Volume</h1>
            <h2>{parseInt(this.props.stats.volume, 10)}</h2>
          </div>
          <div className="sub sub-right">
            <h1>Close</h1>
            <h2>${parseInt(this.props.stats.close, 10)}</h2>
          </div>
        </div>
      </div>
    );
  }
}
