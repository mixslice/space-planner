import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Rect,
  Line,
  Wedge,
  Group,
  Circle,
  Label,
  Tag,
  Text
} from 'react-konva';
import { updateUnit } from '../reducer/units';
import { getCoords, getUnitType, UNIT_TYPE, getQValue } from '../helper';

class Unit extends Component {
  constructor(props) {
    super(props);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  handleDragStart = e => {
    this.offsetX = this.props.data.x - e.target.x();
    this.offsetY = this.props.data.y - e.target.y();
    this.props.updateUnit(this.props.data.id, {
      isDragging: true
    });
  };
  handleDragMove = e => {
    this.props.updateUnit(this.props.data.id, {
      x: this.offsetX + e.target.x(),
      y: this.offsetY + e.target.y()
    });
  };
  handleDragEnd = () => {
    this.props.updateUnit(this.props.data.id, {
      isDragging: false
    });
  };

  handleTransformStart = e => {
    this.props.updateUnit(this.props.data.id, {
      isDragging: true
    });
  };
  handleTransform = () => {
    this.props.updateUnit(this.props.data.id, {
      x: this.node.x(),
      y: this.node.y(),
      rotation: this.node.rotation()
    });
  };
  handleTransformEnd = e => {
    this.props.updateUnit(this.props.data.id, {
      isDragging: false
    });
  };

  render() {
    const { x: x1, y: y1, width, height, depth, rotation } = this.props.data;
    const buildingType = getUnitType(depth);
    const isHighBuilding = buildingType === UNIT_TYPE.HIGH;

    const Q = getQValue(depth);
    const frontLen1 = 18 * Q;
    const frontLen2 = 24 * Q;
    const backLen = 18 * Q;
    const sideLen = 13 * Q;

    const coords = getCoords(this.props.data);
    const s =
      Math.max(coords[0].x, coords[1].x, coords[2].x, coords[3].x) -
      Math.min(coords[0].x, coords[1].x, coords[2].x, coords[3].x);
    const shadowLen = Math.max((depth - 24) * 0.3 + s, 29);

    let start = Math.floor(-rotation / 90);
    start = ((start % 4) + 4) % 4;

    const points = [
      coords[start].x,
      coords[start].y,
      coords[start].x,
      coords[start].y - shadowLen,
      coords[(start + 1) % 4].x,
      coords[(start + 1) % 4].y - shadowLen,
      coords[(start + 2) % 4].x,
      coords[(start + 2) % 4].y - shadowLen,
      coords[(start + 2) % 4].x,
      coords[(start + 2) % 4].y,
      coords[(start + 3) % 4].x,
      coords[(start + 3) % 4].y
    ];

    return (
      <Group>
        {isHighBuilding && this.props.showsRef && (
          <Line points={points} fill="red" opacity={0.5} closed />
        )}
        <Group
          ref={node => {
            this.node = node;
          }}
          id="unit"
          name={this.props.data.id}
          x={x1}
          y={y1}
          rotation={rotation}
          width={width}
          height={height}
          draggable
          onDragStart={this.handleDragStart}
          onDragMove={this.handleDragMove}
          onDragEnd={this.handleDragEnd}
          onTransformStart={this.handleTransformStart}
          onTransform={this.handleTransform}
          onTransformEnd={this.handleTransformEnd}
        >
          <Rect
            width={width}
            height={height}
            fill={this.props.color[buildingType]}
            stroke="black"
            strokeWidth={1}
            opacity={0.8}
            closed
          />
          <Label>
            <Tag fill="black" pointerDirection="bottom" />
            <Text
              text={`${buildingType}: ${depth}`}
              fontSize={12}
              padding={2}
              fill="white"
            />
          </Label>
        </Group>
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
  color: {
    low: '#D3FFCF',
    middle: '#CFDEFF',
    high: '#FFCFDF'
  }
};

export default connect(
  null,
  {
    updateUnit
  }
)(Unit);
