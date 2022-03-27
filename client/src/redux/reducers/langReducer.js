const initialState = localStorage.getItem("lang") ? localStorage.getItem("lang") : "Eng";
export const langReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LANG":
      localStorage.setItem("lang", action.payload);
      return action.payload;
    default:
      return state;
  }
};
