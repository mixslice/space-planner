import React, { Component } from 'react';
import { Line } from 'react-konva';
import { calcShadow } from '../helper';

class UnitShadow extends Component {
  state = {
    color: 'black'
  };
  render() {
    const lat = 31.2304;
    const lng = 121.4737;
    const { x: x1, y: y1, width, height, depth, rotation } = this.props.target;
    const { shiftX, shiftY, degree } = calcShadow(
      this.props.date,
      lat,
      lng,
      depth
    );

    const rot = (rotation * Math.PI) / 180;

    const x2 = x1 + width * Math.cos(rot);
    const x4 = x1 - height * Math.sin(rot);
    const x3 = x4 + x2 - x1;

    const y2 = y1 + width * Math.sin(rot);
    const y4 = y1 + height * Math.cos(rot);
    const y3 = y4 + y2 - y1;

    const x = [x1, x2, x3, x4];
    const y = [y1, y2, y3, y4];

    let start = Math.floor((degree - rotation) / 90);
    start = ((start % 4) + 4) % 4;

    const points = [
      x[start],
      y[start],
      x[start] + shiftX,
      y[start] + shiftY,
      x[(start + 1) % 4] + shiftX,
      y[(start + 1) % 4] + shiftY,
      x[(start + 2) % 4] + shiftX,
      y[(start + 2) % 4] + shiftY,
      x[(start + 2) % 4],
      y[(start + 2) % 4],
      x[(start + 3) % 4],
      y[(start + 3) % 4]
    ];

    return <Line points={points} fill={this.state.color} closed />;
  }
}

UnitShadow.defaultProps = {
  centerX: 0,
  centerY: 0,
  rotation: 0,
  width: 50,
  height: 50,
  depth: 50,
  date: new Date('2018-01-20 08:00')
};

export default UnitShadow;
