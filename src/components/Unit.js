import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Rect, Line, Wedge, Group, Circle } from 'react-konva';
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

  handleTransform = () => {
    this.props.updateTarget(this.props.target.id, {
      x: this.node.x(),
      y: this.node.y(),
      rotation: this.node.rotation()
    });
  };

  render() {
    const { x: x1, y: y1, width, height, depth, rotation } = this.props.target;
    const isHighBuilding = depth > 24;

    const Q = QValue(depth);
    const frontLen1 = 18 * Q;
    const frontLen2 = 24 * Q;
    const backLen = 18 * Q;
    const sideLen = 13 * Q;

    const rot = (rotation * Math.PI) / 180;

    const x2 = x1 + width * Math.cos(rot);
    const x4 = x1 - height * Math.sin(rot);
    const x3 = x4 + x2 - x1;
    const s = Math.max(x1, x2, x3, x4) - Math.min(x1, x2, x3, x4);
    const shadowLen = Math.max((depth - 24) * 0.3 + s, 29);

    const y2 = y1 + width * Math.sin(rot);
    const y4 = y1 + height * Math.cos(rot);
    const y3 = y4 + y2 - y1;

    const x = [x1, x2, x3, x4];
    const y = [y1, y2, y3, y4];

    let start = Math.floor(-rotation / 90);
    start = ((start % 4) + 4) % 4;

    const points = [
      x[start],
      y[start],
      x[start],
      y[start] - shadowLen,
      x[(start + 1) % 4],
      y[(start + 1) % 4] - shadowLen,
      x[(start + 2) % 4],
      y[(start + 2) % 4] - shadowLen,
      x[(start + 2) % 4],
      y[(start + 2) % 4],
      x[(start + 3) % 4],
      y[(start + 3) % 4]
    ];

    return (
      <Group>
        {isHighBuilding && this.props.showsRef && (
          <Line points={points} fill="red" opacity={0.5} closed />
        )}
        <Rect
          ref={node => {
            this.node = node;
          }}
          name={String(this.props.target.id)}
          x={x1}
          y={y1}
          width={width}
          height={height}
          rotation={rotation}
          fill={
            isHighBuilding
              ? this.props.highBuildingColor
              : this.props.defaultColor
          }
          closed
          draggable
          onDragStart={this.handleDragStart}
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
          onTransform={this.handleTransform}
        />
        <Group x={x1} y={y1} rotation={rotation}>
          {this.props.showsRef && (
            <Group>
              <Rect
                y={-backLen}
                width={width}
                height={backLen}
                fill="blue"
                opacity={0.5}
                closed
              />
              <Rect
                x={-sideLen}
                width={sideLen}
                height={height}
                fill="cyan"
                opacity={0.5}
                closed
              />
              <Rect
                x={width}
                width={sideLen}
                height={height}
                fill="cyan"
                opacity={0.5}
                closed
              />
              <Wedge
                radius={sideLen}
                angle={90}
                fill="cyan"
                rotation={180}
                opacity={0.5}
              />
              <Wedge
                x={width}
                radius={sideLen}
                angle={90}
                fill="cyan"
                rotation={-90}
                opacity={0.5}
              />
              <Wedge
                y={height}
                radius={sideLen}
                angle={90}
                fill="cyan"
                rotation={90}
                opacity={0.5}
              />
              <Wedge
                x={width}
                y={height}
                radius={sideLen}
                angle={90}
                fill="cyan"
                opacity={0.5}
              />
              <Rect
                y={height}
                width={width}
                height={frontLen1}
                fill="yellow"
                opacity={0.5}
                closed
              />
              <Rect
                y={height}
                width={width}
                height={frontLen2}
                fill="yellow"
                opacity={0.5}
                closed
              />
              <Circle
                x={width}
                y={height}
                radius={frontLen2}
                stroke="fuchsia"
              />
              <Circle x={0} y={height} radius={frontLen2} stroke="fuchsia" />
            </Group>
          )}
        </Group>
      </Group>
    );
  }
}

Unit.defaultProps = {
  defaultColor: 'green',
  highBuildingColor: '#fff'
};

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
