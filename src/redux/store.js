import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./slice/employeeSlice";

const store = configureStore({
    reducer: {
        employees: employeeReducer,
    },
});

export default store;
