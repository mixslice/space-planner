import uuid from 'uuid/v4';

const initialState = [
  {
    id: uuid(),
    x: 650,
    y: 160,
    width: 100,
    height: 40,
    depth: 20,
    rotation: 0,
    isDragging: false
  },
  {
    id: uuid(),
    x: 480,
    y: 300,
    width: 100,
    height: 40,
    depth: 50,
    rotation: -20,
    isDragging: false
  },
  {
    id: uuid(),
    x: 400,
    y: 250,
    width: 100,
    height: 40,
    depth: 10,
    rotation: -80,
    isDragging: false
  },
  {
    id: uuid(),
    x: 250,
    y: 450,
    width: 100,
    height: 40,
    depth: 100,
    rotation: 30,
    isDragging: false
  },
  {
    id: uuid(),
    x: 550,
    y: 450,
    width: 100,
    height: 40,
    depth: 15,
    rotation: 0,
    isDragging: false
  }
];

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_UNIT': {
      return state.map(unit => {
        if (unit.id !== action.payload.id) {
          return unit;
        }
        return {
          ...unit,
          ...action.payload.attrs
        };
      });
    }
    default:
      return state;
  }
};

// action creators
export const updateUnit = (id, attrs) => ({
  type: 'UPDATE_UNIT',
  payload: { id, attrs }
});
