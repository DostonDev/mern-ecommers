const initialState = [];
export const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PRODUCT": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
