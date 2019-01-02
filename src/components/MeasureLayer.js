import React, { Component } from 'react';
import { distanceBetweenUnits, calcLimit, getRoughDistance } from '../helper';
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
          const { distanceX, distanceY } = getRoughDistance(draggingUnit, d);

          const paddingX = 20;
          const paddingY = 50;
          const depth = draggingUnit.y < d.y ? d.depth : draggingUnit.depth;
          if (distanceX > 24 * 1.8 + paddingX) return null;
          if (distanceY > Math.max(1.2 * depth, 29) + paddingY) return null;

          const { points, distance, isGable } = distanceBetweenUnits(
            draggingUnit,
            d
          );
          const { limit, isIntersected, isFacing } = calcLimit(
            draggingUnit,
            d,
            isGable
          );
          let color;
          if (isIntersected) {
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
