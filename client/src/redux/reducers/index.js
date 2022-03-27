import { combineReducers } from "redux";
import { globalState } from "./globalState";
import { isAdminReducer } from "./isAdminReducer";
import { langReducer } from "./langReducer";
import { loadingReducer } from "./loadingReducer";
import { ProductReducer } from "./ProductReducer";
import { userReducer } from "./userReducer";

export const rootReducer = combineReducers({
  globalState: globalState,
  products: ProductReducer,
  lang: langReducer,
  loading: loadingReducer,
  auth: userReducer,
  isAdmin: isAdminReducer,
});
