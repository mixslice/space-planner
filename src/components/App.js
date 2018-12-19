import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import SunCalc from 'suncalc';
import Unit from './Unit';
import UnitShadow from './UnitShadow';
import './App.css';

class App extends Component {
  state = {
    startDate: null,
    max: 0,
    value: 0,
    width: 0,
    height: 0
  };

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);

    const lat = 31.2304;
    const lng = 121.4737;
    const { sunriseEnd, sunsetStart } = SunCalc.getTimes(
      new Date('2018-01-20'),
      lat,
      lng
    );
    const steps = Math.floor((sunsetStart - sunriseEnd) / 30 / 60 / 1000);
    this.setState({
      startDate: sunriseEnd.valueOf(),
      max: steps,
      value: Math.floor(steps / 3)
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render() {
    return (
      <div className="App">
        <input
          type="range"
          min="0"
          max={this.state.max}
          value={this.state.value}
          onChange={e => {
            this.setState({ value: e.target.value });
          }}
        />
        <div className="App-canvas">
          <Stage width={this.state.width} height={this.state.height}>
            {this.state.startDate && (
              <Layer opacity={0.5}>
                {this.props.targets.map(t => {
                  const date = new Date(
                    this.state.startDate + this.state.value * 30 * 60 * 1000
                  );
                  return <UnitShadow key={t.id} target={t} date={date} />;
                })}
              </Layer>
            )}
            <Layer>
              {this.props.targets.map(t => (
                <Unit key={t.id} target={t} />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
}

export default connect(({ targets }) => ({
  targets
}))(App);
