import axios from "axios";

const BASE_URL = "https://69060af5ee3d0d14c13490d4.mockapi.io/api/v1";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },//dùng để gửi data lên srever và ngược lại kiểu json, phải  đúng định dạng
    timeout: 10000,
});

// Request interceptor công dụng của nó là để xử lý hoặc thay đổi các yêu cầu trước khi chúng được gửi đi.
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response interceptor công dụng của nó là để xử lý hoặc thay đổi các phản hồi trước khi chúng được trả về cho phần gọi hàm.
axiosInstance.interceptors.response.use(
    (response) => response, // Trả về phản hồi nếu thành công
    (error) => { // Xử lý lỗi
        const errorMessage = error.response?.data?.message || error.message;// Lấy thông điệp lỗi từ phản hồi hoặc từ đối tượng lỗi
        return Promise.reject(new Error(errorMessage));
    }
);

export const findEmployees = async () => {
    const response = await axiosInstance.get("/nhansu");
    return response;
};

export const findEmployee = async (employeeId) => {
    const response = await axiosInstance.get(`/nhansu/${employeeId}`);
    return response;
};

export const createEmployee = async (employee) => {
    const response = await axiosInstance.post("/nhansu", employee);
    return response;
};

export const updateEmployee = async (employee) => {
    const response = await axiosInstance.put(`/nhansu/${employee.id}`, employee);
    return response;
};

export const deleteEmployee = async (employeeId) => {
    const response = await axiosInstance.delete(`/nhansu/${employeeId}`);
    return response;
};
