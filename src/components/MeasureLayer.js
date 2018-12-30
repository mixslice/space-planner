import React, { Component } from 'react';
import { Layer } from 'react-konva';
import { distanceBetweenUnits, calcLimit } from '../helper';
import MeasureLine from './MeasureLine';

class MeasureLayer extends Component {
  render() {
    let unit0 = this.props.data.filter(d => d.isDragging)[0];
    if (unit0) {
      this.unit = unit0;
    }
    unit0 = unit0 || this.unit;
    let measures = null;
    if (unit0) {
      measures = this.props.data
        .filter(d => d.id !== unit0.id)
        .map(d => {
          const { points, distance, isGable } = distanceBetweenUnits(unit0, d);
          const limit = calcLimit(unit0, d, isGable);
          return (
            <MeasureLine points={points} distance={distance} limit={limit} />
          );
        });
    }
    return <Layer>{measures}</Layer>;
  }
}

MeasureLayer.defaultProps = {
  color: {
    default: 'blue',
    inShadow: undefined
  }
};

export default MeasureLayer;
