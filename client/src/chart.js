import React, { Component } from 'react';

export default class Chart extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <div />;
  }
}
<VictoryVoronoiContainer
width={800}
height={800}
labels={d => d.y}
/>