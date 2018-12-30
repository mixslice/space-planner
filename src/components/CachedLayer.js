import React, { Component } from 'react';
import { FastLayer } from 'react-konva';
import { connect } from 'react-redux';

class CustomLayer extends Component {
  componentDidMount() {
    this.node.cache();
  }
  componentDidUpdate() {
    this.node.cache();
  }
  componentWillReceiveProps(newProps) {
    if (newProps.dateValue !== this.props.dateValue) {
      this.node.clearCache();
    }
  }
  render() {
    return (
      <FastLayer
        ref={node => {
          this.node = node;
        }}
        {...this.props}
      />
    );
  }
}

export default connect(({ location }) => ({
  dateValue: location.dateValue
}))(CustomLayer);
