const initialState = {
  showsShadow: false,
  showsRef: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_CONFIG':
      const { name, value } = action.payload;
      return {
        ...state,
        [name]: value
      };
    default:
      return state;
  }
};

export const updateConfig = (name, value) => ({
  type: 'UPDATE_CONFIG',
  payload: { name, value }
});
