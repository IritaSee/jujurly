import { persistReducer } from "redux-persist";
import storage from "./storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
