import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-konva';
import { calcShadow, getCoords } from '../helper';

class UnitShadow extends Component {
  state = {
    color: 'black'
  };

  render() {
    const { lat, lng, dateValue } = this.props.location;
    const date = new Date(dateValue);

    const { depth, rotation } = this.props.data;
    const { shiftX, shiftY, degree } = calcShadow(date, lat, lng, depth);
    const coords = getCoords(this.props.data);

    let start = Math.floor((degree - rotation) / 90);
    start = ((start % 4) + 4) % 4;

    const points = [
      coords[start].x,
      coords[start].y,
      coords[start].x + shiftX,
      coords[start].y + shiftY,
      coords[(start + 1) % 4].x + shiftX,
      coords[(start + 1) % 4].y + shiftY,
      coords[(start + 2) % 4].x + shiftX,
      coords[(start + 2) % 4].y + shiftY,
      coords[(start + 2) % 4].x,
      coords[(start + 2) % 4].y,
      coords[(start + 3) % 4].x,
      coords[(start + 3) % 4].y
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
  depth: 50
};

export default connect(({ location }) => ({
  location
}))(UnitShadow);
