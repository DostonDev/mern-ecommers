export const isAdminReducer = (state = false, action) => {
  switch (action.type) {
    case "ADMIN": {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
