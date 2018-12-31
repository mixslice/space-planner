import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Stage, Layer, FastLayer } from 'react-konva';
import MeasureLayer from './MeasureLayer';
import Unit from './Unit';
import UnitShadow from './UnitShadow';
import TransformerComponent from './TransformerComponent';
import Toolbar from './Toolbar';
import './App.css';

const TOOLBAR_HEIGHT = 44;

class App extends Component {
  state = {
    // window
    width: 0,
    height: 0,
    selectedShapeName: null
  };

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
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
    const name =
      e.target.findAncestor('#unit') && e.target.findAncestor('#unit').name();
    const rect = this.props.units.find(t => t.id === name);
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
        <Toolbar />
        <div className="App-canvas">
          <Stage
            width={this.state.width}
            height={this.state.height}
            onMouseDown={this.handleStageMouseDown}
          >
            {this.props.config.showsShadow && (
              <FastLayer opacity={0.5}>
                {this.props.units.map(t => (
                  <UnitShadow key={t.id} data={t} />
                ))}
              </FastLayer>
            )}
            <Layer>
              {this.props.units.map(t => (
                <Unit
                  key={t.id}
                  data={t}
                  showsRef={this.props.config.showsRef}
                />
              ))}
              <MeasureLayer data={this.props.units} />
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

export default connect(({ units, config }) => ({
  units,
  config
}))(App);
