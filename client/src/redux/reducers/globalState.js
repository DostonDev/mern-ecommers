const initialState = {
  cart: [],
  isChange: false,
  histories: [],
  history: null,
  categories: [],
  idState: null,
  page: 1,
};
export const globalState = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      return { ...state, cart: action.payload };
    }
    case "CHANGE": {
      return { ...state, isChange: action.payload };
    }
    case "GET_HISTORIES": {
      return { ...state, histories: action.payload };
    }
    case "GET_HISTORY": {
      return { ...state, history: action.payload };
    }
    case "GET_CATEGORIES": {
      return { ...state, categories: action.payload };
    }
    case "ID_STATE": {
      return { ...state, idState: action.payload };
    }
    case "PAGE": {
      return { ...state, page: state.page + 1 };
    }
    default: {
      return state;
    }
  }
};
