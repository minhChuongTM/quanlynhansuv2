import axios from "axios";

const BASE_URL = "https://69060af5ee3d0d14c13490d4.mockapi.io/api/v1";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.message || error.message;
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
