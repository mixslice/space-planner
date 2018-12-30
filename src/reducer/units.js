const initialState = [
  {
    id: 1,
    x: 150,
    y: 150,
    width: 100,
    height: 50,
    depth: 20,
    rotation: 0,
    isDragging: false
  },
  {
    id: 2,
    x: 480,
    y: 300,
    width: 150,
    height: 50,
    depth: 50,
    rotation: -20,
    isDragging: false
  },
  {
    id: 3,
    x: 400,
    y: 250,
    width: 100,
    height: 50,
    depth: 200,
    rotation: -80,
    isDragging: false
  },
  {
    id: 4,
    x: 250,
    y: 450,
    width: 100,
    height: 50,
    depth: 100,
    rotation: 30,
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
