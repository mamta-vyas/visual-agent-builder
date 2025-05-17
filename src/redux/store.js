import { configureStore } from "@reduxjs/toolkit";
import builderReducer from "./builderSlice";

export const store = configureStore({
  reducer: {
    builder: builderReducer,
  },
});
