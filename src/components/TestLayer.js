import React, { Component } from 'react';
import { Layer, Line } from 'react-konva';
import { pointToSeg } from '../helper';

class TestLayer extends Component {
  render() {
    const x1 = 100;
    const y1 = 100;
    const x2 = 200;
    const y2 = 200;
    const x3 = 160;
    const y3 = 100;
    const { x: x4, y: y4 } = pointToSeg(x1, y1, x2, y2, x3, y3);

    return (
      <Layer>
        <Line points={[x1, y1, x2, y2]} strokeWidth={3} stroke="red" />
        <Line points={[x3, y3, x4, y4]} strokeWidth={3} stroke="red" />
      </Layer>
    );
  }
}

export default TestLayer;
