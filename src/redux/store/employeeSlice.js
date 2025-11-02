import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {createEmployee, deleteEmployee, findEmployee, findEmployees, updateEmployee} from "../../api/api"
const initialState = {
    values: null,
    value: null,
    loading: false,
    error: null,
};
export const getEmployees = createAsyncThunk("employee/list", async () => {
    const response = await findEmployees();
    return response.data;
});
export const getEmployee = createAsyncThunk("employee/detail", async (employeeId) => {
    const response = await findEmployee(employeeId);
    return response.data;
});
export const addEmployee = createAsyncThunk("employee/create", async (employee) => {
    const response = await createEmployee(employee);
    return response.data;
});
export const editEmployee = createAsyncThunk("employee/edit", async (employee) => {
    const response = await updateEmployee(employee);
    return response.data;
});
export const removeEmployee = createAsyncThunk("employee/remove", async (employeeId) => {
    const response = await deleteEmployee(employeeId);
    return response.data;
});
export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Get Employees
            .addCase(getEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.values = action.payload;
                state.error = null;
            })

            // Get Employee
            .addCase(getEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(getEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.value = action.payload;
                state.error = null;
            })

            // Add Employee
            .addCase(addEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.value = action.payload;
                state.error = null;
            })

            // Edit Employee
            .addCase(editEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(editEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.value = action.payload;
                state.error = null;
            })

            // Remove Employee
            .addCase(removeEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(removeEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.value = action.payload;
                state.error = null;
            });
    },
});

// Selectors
export const selectLoading = (state) => state.employees.loading;
export const selectError = (state) => state.employees.error;
export const selectEmployeeList = (state) => state.employees.values;
export const selectEmployeeDetail = (state) => state.employees.value;

export default employeeSlice.reducer;
