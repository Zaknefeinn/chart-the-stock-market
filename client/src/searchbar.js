import React, { Component } from 'react';

export default class Searchbar extends Component {
  render() {
    return (
      <div className="search-container">
        <form onSubmit={this.props.handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Stock Symbol"
              value={this.props.term}
              onChange={this.props.onInputChange}
            />
            <div className="input-group-append">
              <button className="btn" type="submit">
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
