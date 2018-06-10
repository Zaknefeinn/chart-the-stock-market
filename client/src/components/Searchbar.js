import React, { Component } from 'react';

export default class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term: ''
    };
  }
  onInputChange = e => {
    this.setState({ term: e.target.value });
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({ term: '' });
    this.props.handleSubmit(this.state.term);
  };
  render() {
    return (
      <div className="search-container">
        <form onSubmit={this.handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Stock Symbol"
              value={this.state.term}
              onChange={this.onInputChange}
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
