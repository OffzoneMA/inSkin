import { combineReducers } from "@reduxjs/toolkit";

import appReducer from "./slices/app/appSlice";

const rootReducer = combineReducers({
  appReducer,
});

export default rootReducer;
