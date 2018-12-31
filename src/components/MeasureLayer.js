import React, { Component } from 'react';
import { distanceBetweenUnits, calcLimit, checkFacing } from '../helper';
import MeasureLine from './MeasureLine';

class MeasureLayer extends Component {
  render() {
    let draggingUnit =
      this.props.data.filter(d => d.isDragging)[0] ||
      this.unit ||
      this.props.data[0];
    this.unit = draggingUnit;
    let measures = null;
    if (draggingUnit) {
      measures = this.props.data
        .filter(d => d.id !== draggingUnit.id)
        .map((d, idx) => {
          const { points, distance, isGable } = distanceBetweenUnits(
            draggingUnit,
            d
          );
          const { limit, isIntersection, isFacing } = calcLimit(
            draggingUnit,
            d,
            isGable
          );
          let color;
          if (isIntersection) {
            color = undefined;
          } else if (isFacing) {
            color = '#E75C00';
          } else if (isGable) {
            color = 'blue';
          } else {
            color = '#109D56';
          }
          return (
            <MeasureLine
              key={d.id}
              points={points}
              distance={distance}
              limit={limit}
              color={color}
            />
          );
        });
    }
    return measures;
  }
}

export default MeasureLayer;
