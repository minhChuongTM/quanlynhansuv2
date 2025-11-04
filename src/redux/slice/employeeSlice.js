import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createEmployee, deleteEmployee, findEmployee, findEmployees, updateEmployee } from "../../api/api";

// initialState: Trạng thái ban đầu của slice employee
const initialState = {
    values: null, // Danh sách nhân viên
    value: null, // Chi tiết một nhân viên
    loading: false, // Trạng thái loading khi gọi API
    error: null, // Lưu thông báo lỗi nếu có
};

// getEmployees: Lấy danh sách tất cả nhân viên từ API
export const getEmployees = createAsyncThunk("employee/list", async () => {
    const response = await findEmployees();
    return response.data;
});

// getEmployee: Lấy thông tin chi tiết một nhân viên theo id từ API
export const getEmployee = createAsyncThunk("employee/detail", async (employeeId) => {
    const response = await findEmployee(employeeId);
    return response.data;
});

// addEmployee: Thêm mới một nhân viên qua API
export const addEmployee = createAsyncThunk("employee/create", async (employee) => {
    const response = await createEmployee(employee);
    return response.data;
});

// editEmployee: Chỉnh sửa thông tin một nhân viên qua API
export const editEmployee = createAsyncThunk("employee/edit/:id", async (employee) => {
    const response = await updateEmployee(employee);
    return response.data;
});

// removeEmployee: Xóa một nhân viên theo id qua API
export const removeEmployee = createAsyncThunk("employee/remove", async (employeeId) => {
    const response = await deleteEmployee(employeeId);
    return response.data;
});

// employeeSlice: Slice quản lý trạng thái nhân viên, xử lý các action bất đồng bộ (bên trong là tập hợp các reducer)
export const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {}, // Không sử dụng reducer đồng bộ
    extraReducers: (builder) => {
        builder
            // Get Employees
            .addCase(getEmployees.pending, (state) => {
                state.loading = true; //thông báo trạng thai đang tải dữ liệu cho người dùng
                state.error = null;
            })

            //reject gặp lỗi
            .addCase(getEmployees.rejected, (state, action) => {
                state.loading = false; // gặp lội không sử dụng loading
                state.error = action.error.message; // trả về thẳng lỗi
            })

            //fulfiled hoàng thành
            .addCase(getEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.values = action.payload;//value của redux = dữ liệu được trả về từ api 
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
export const selectLoading = (state) => state.employees.loading; // Lấy trạng thái loading // = empty
export const selectError = (state) => state.employees.error; // Lấy thông báo lỗi
export const selectEmployeeList = (state) => state.employees.values; // Lấy danh sách nhân viên
export const selectEmployeeDetail = (state) => state.employees.value; // Lấy chi tiết một nhân viên

export default employeeSlice.reducer;
