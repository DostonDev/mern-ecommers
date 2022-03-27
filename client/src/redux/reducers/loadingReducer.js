export const loadingReducer = (state = false, action) => {
  switch (action.type) {
    case "LOADING": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
