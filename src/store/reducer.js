const initialState = {
  targets: [
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
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TARGET': {
      const targets = state.targets.map(target => {
        if (target.id !== action.payload.id) {
          return target;
        }
        return {
          ...target,
          ...action.payload.attrs
        };
      });
      return {
        ...state,
        targets
      };
    }
    default:
      return state;
  }
};

// action creators
export const updateTarget = (id, attrs) => ({
  type: 'UPDATE_TARGET',
  payload: { id, attrs }
});

export default reducer;
