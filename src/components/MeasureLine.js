import React, { Component } from 'react';
import { Group, Line, Label, Tag, Text } from 'react-konva';

class MeasureLine extends Component {
  render() {
    const {
      color,
      errorColor,
      points: { 0: p1, 1: p2 },
      distance,
      limit
    } = this.props;
    const labelX = (p1.x + p2.x) / 2;
    const labelY = (p1.y + p2.y) / 2;
    const hasFault = distance < limit;

    return (
      <Group>
        <Line
          points={[p1.x, p1.y, p2.x, p2.y]}
          strokeWidth={1}
          stroke={hasFault ? errorColor : color}
        />
        <Label x={labelX} y={labelY}>
          <Tag
            fill={color}
            opacity={0.8}
            lineJoin="round"
            pointerDirection="left"
          />
          <Text
            text={distance.toFixed(0)}
            fontSize={11}
            padding={2}
            fill="white"
          />
        </Label>
        <Label x={labelX} y={labelY}>
          <Tag
            fill={hasFault ? errorColor : 'black'}
            opacity={0.8}
            lineJoin="round"
            pointerDirection="right"
          />
          <Text
            text={limit.toFixed(1)}
            fontSize={11}
            padding={2}
            fill="white"
          />
        </Label>
      </Group>
    );
  }
}

MeasureLine.defaultProps = {
  color: '#BD10E0',
  errorColor: 'red',
  limit: 0
};

export default MeasureLine;
