import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Stage, Layer } from 'react-konva';
import SunCalc from 'suncalc';
import Unit from './Unit';
import UnitShadow from './UnitShadow';
import TransformerComponent from './TransformerComponent';
import './App.css';

const TOOLBAR_HEIGHT = 44;

class App extends Component {
  state = {
    // shadow
    startDate: null,
    max: 0,
    value: 0,
    showsShadow: false,
    showsRef: true,
    // window
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
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight - TOOLBAR_HEIGHT
    });
  };

  handleStageMouseDown = e => {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: null
      });
      return;
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    const rect = this.props.targets.find(t => String(t.id) === name);
    if (rect) {
      this.setState({
        selectedShapeName: name
      });
    } else {
      this.setState({
        selectedShapeName: null
      });
    }
  };

  render() {
    return (
      <div className="App">
        <div className="Toolbar">
          <div className="Control">
            <input
              type="checkbox"
              checked={this.state.showsRef}
              onChange={e => {
                this.setState({ showsRef: e.target.checked });
              }}
            />
            <label>显示参考</label>
          </div>
          <div className="Control">
            <input
              type="checkbox"
              checked={this.state.showsShadow}
              onChange={e => {
                this.setState({ showsShadow: e.target.checked });
              }}
            />
            <label>显示阴影</label>
          </div>
          <div className="Control">
            <input
              type="range"
              min="0"
              max={this.state.max}
              value={this.state.value}
              onChange={e => {
                this.setState({ value: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="App-canvas">
          <Stage
            width={this.state.width}
            height={this.state.height}
            onMouseDown={this.handleStageMouseDown}
          >
            {this.state.startDate && this.state.showsShadow && (
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
                <Unit key={t.id} target={t} showsRef={this.state.showsRef} />
              ))}
              <TransformerComponent
                selectedShapeName={this.state.selectedShapeName}
              />
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
