import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateConfig } from '../reducer/config';
import { updateDatetime } from '../reducer/location';

class Toolbar extends Component {
  render() {
    const { dateStartValue, dateEndValue, dateValue } = this.props.location;
    return (
      <div className="Toolbar">
        <div className="Control">
          <input
            type="checkbox"
            checked={this.props.config.showsRef}
            onChange={e => {
              this.props.updateConfig('showsRef', e.target.checked);
            }}
          />
          <label>显示参考</label>
        </div>
        <div className="Control">
          <input
            type="checkbox"
            checked={this.props.config.showsShadow}
            onChange={e => {
              this.props.updateConfig('showsShadow', e.target.checked);
            }}
          />
          <label>显示阴影</label>
        </div>
        <div className="Control">
          <input
            type="range"
            min={dateStartValue}
            max={dateEndValue}
            value={dateValue}
            onChange={e => {
              this.props.updateDatetime(e.target.value);
            }}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  ({ config, location }) => ({ config, location }),
  { updateConfig, updateDatetime }
)(Toolbar);
