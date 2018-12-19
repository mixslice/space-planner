import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line, Arc, Group } from 'react-konva';
import { updateTarget } from '../store/reducer';

class Unit extends Component {
  constructor(props) {
    super(props);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  handleDragStart = e => {
    this.offsetX = this.props.target.x - e.target.x();
    this.offsetY = this.props.target.y - e.target.y();
    this.props.updateTarget(this.props.target.id, {
      isDragging: true
    });
  };
  handleDragMove = e => {
    this.props.updateTarget(this.props.target.id, {
      x: this.offsetX + e.target.x(),
      y: this.offsetY + e.target.y()
    });
  };
  handleDragEnd = () => {
    this.props.updateTarget(this.props.target.id, {
      isDragging: false
    });
  };

  render() {
    const { x: x1, y: y1, width, height, depth, rotation } = this.props.target;
    const rot = (rotation * Math.PI) / 180;

    const x2 = x1 + width * Math.cos(rot);
    const x4 = x1 - height * Math.sin(rot);
    const x3 = x4 + x2 - x1;

    const y2 = y1 + width * Math.sin(rot);
    const y4 = y1 + height * Math.cos(rot);
    const y3 = y4 + y2 - y1;

    // front
    const Q = QValue(depth);
    const frontLen = 18 * Q;
    const xf1 = x3 - frontLen * Math.sin(rot);
    const yf1 = y3 + frontLen * Math.cos(rot);
    const xf2 = xf1 - x3 + x4;
    const yf2 = yf1 - y3 + y4;

    // back
    const backLen = 18 * Q;
    const xb1 = x1 + backLen * Math.sin(rot);
    const yb1 = y1 - backLen * Math.cos(rot);
    const xb2 = xb1 - x1 + x2;
    const yb2 = yb1 - y1 + y2;

    // side
    const sideLen = 13 * Q;
    const xs1 = x1 - sideLen * Math.cos(rot);
    const ys1 = y1 - sideLen * Math.sin(rot);
    const xs2 = x2 - xs1 + x1;
    const ys2 = y2 - ys1 + y1;
    const xs3 = x3 - xs1 + x1;
    const ys3 = y3 - ys1 + y1;
    const xs4 = xs1 - x1 + x4;
    const ys4 = ys1 - y1 + y4;

    return (
      <Group
        draggable
        onDragStart={this.handleDragStart}
        onDragMove={this.handleDragMove}
        onDragEnd={this.handleDragEnd}
      >
        <Line points={[x1, y1, x2, y2, x3, y3, x4, y4]} fill="green" closed />
        <Line
          points={[x3, y3, xf1, yf1, xf2, yf2, x4, y4]}
          opacity={0.5}
          fill="yellow"
          closed
        />
        <Line
          points={[x1, y1, xb1, yb1, xb2, yb2, x2, y2]}
          opacity={0.5}
          fill="blue"
          closed
        />
        <Line
          points={[x1, y1, xs1, ys1, xs4, ys4, x4, y4]}
          opacity={0.5}
          fill="cyan"
          closed
        />
        <Line
          points={[x2, y2, xs2, ys2, xs3, ys3, x3, y3]}
          opacity={0.5}
          fill="cyan"
          closed
        />
        <Arc
          x={x1}
          y={y1}
          outerRadius={sideLen}
          angle={90}
          fill="cyan"
          opacity={0.5}
          rotation={rotation + 180}
        />
        <Arc
          x={x2}
          y={y2}
          outerRadius={sideLen}
          angle={90}
          fill="cyan"
          opacity={0.5}
          rotation={rotation - 90}
        />
        <Arc
          x={x3}
          y={y3}
          outerRadius={sideLen}
          angle={90}
          fill="cyan"
          opacity={0.5}
          rotation={rotation}
        />
        <Arc
          x={x4}
          y={y4}
          outerRadius={sideLen}
          angle={90}
          fill="cyan"
          opacity={0.5}
          rotation={rotation + 90}
        />
      </Group>
    );
  }
}

export default connect(
  null,
  {
    updateTarget
  }
)(Unit);

const QValue = height => {
  if (height <= 50) {
    return 1;
  } else if (height <= 75) {
    return 1.2;
  } else if (height <= 100) {
    return 1.4;
  } else if (height <= 200) {
    return 1.6;
  } else {
    return 1.8;
  }
};
