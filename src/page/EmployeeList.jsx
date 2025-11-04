import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployees, selectEmployeeList, removeEmployee, selectLoading } from "../redux/slice/employeeSlice";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";


const DEPARTMENTS = [
    "Engineering",
    "Quality Assurance",
    "Product",
    "Finance",
    "Operations",
    "Human Resources",
    "Design",
    "Sales",
    "Marketing",
];

function EmployeeList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const employees = useSelector(selectEmployeeList);
    const loading = useSelector(selectLoading);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const confirm = useConfirm(); // Sử dụng hook useConfirm để hiển thị hộp thoại xác nhận

    // const { id } = useParams(); // Lấy id từ URL

    useEffect(() => {
        dispatch(getEmployees());
    }, [dispatch]);

    const filteredAndSortedEmployees = useMemo(() => {
        if (!employees) return [];

        let filtered = employees.filter((employee) => {
            const searchLower = searchTerm.toLowerCase();
            const fullNameMatch = employee.fullName?.toLowerCase().includes(searchLower);
            const emailMatch = employee.email?.toLowerCase().includes(searchLower);
            return fullNameMatch || emailMatch;
        });

        if (selectedDepartment !== "all") {
            filtered = filtered.filter((employee) => employee.department === selectedDepartment);
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA; //desc
        });

        return filtered;
    }, [employees, searchTerm, sortOrder, selectedDepartment]);

    const handleDelete = async (employee) => {
        try {
            await confirm({
                title: "Xác nhận xóa",
                description: `Bạn có chắc chắn muốn xóa nhân viên ${employee.fullName} ?`,
                confirmationText: "xóa",
                cancellationText: "Hủy",
            });
            const result = await dispatch(removeEmployee(employee.id));
            if (result.meta.requestStatus === "fulfilled") {
                toast.success("Xóa nhân viên thành công", {
                    position: "top-right",
                    autoClose: 3000,
                });
                dispatch(getEmployees());
            } else {
                toast.error("Có lỗi xảy ra khi xóa nhân viên!", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.log(error);
            employee;
        }
    };

    const handleEdit = (employee) => {
        navigate(`/employee/edit/${employee.id}`);
    };

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6 border-b border-green-500 pb-3 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Danh sách nhân viên</h2>
            </div>

            {/* Filter Section */}
            <div className="mb-6 flex flex-wrap gap-4 items-end bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                {/* Search Box */}
                <div className="relative flex-1 min-w-[250px]">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    {searchTerm && (
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                            onClick={() => setSearchTerm("")}
                            title="Xóa tìm kiếm"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Department Filter */}
                <div className="flex flex-col">
                    <label htmlFor="department" className="text-sm font-medium text-gray-700 mb-1">
                        Phòng ban:
                    </label>
                    <select
                        id="department"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <option value="all">Tất cả</option>
                        {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort Filter */}
                <div className="flex flex-col">
                    <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700 mb-1">
                        Sắp xếp:
                    </label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 w-30 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <option value="desc">Mới nhất</option>
                        <option value="asc">Cũ nhất</option>
                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-green-500 text-white">
                        <tr>
                            <th className="py-3 px-4 font-semibold">ID</th>
                            <th className="py-3 px-4 font-semibold">Họ và tên</th>
                            <th className="py-3 px-4 font-semibold">Email</th>
                            <th className="py-3 px-4 font-semibold">Phòng ban</th>
                            <th className="py-3 px-4 font-semibold">Chức vụ</th>
                            <th className="py-3 px-4 font-semibold">Ngày vào làm</th>
                            <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedEmployees.length > 0 ? (
                            filteredAndSortedEmployees.map((employee) => (
                                <tr key={employee.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="py-3 px-4">{employee.id}</td>
                                    <td className="py-3 px-4 font-medium text-gray-800">{employee.fullName}</td>
                                    <td className="py-3 px-4">{employee.email}</td>
                                    <td className="py-3 px-4">{employee.department}</td>
                                    <td className="py-3 px-4">{employee.position}</td>
                                    <td className="py-3 px-4">
                                        {new Date(employee.startDate).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            onClick={() => handleEdit(employee)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg mr-2 transition"
                                            title="Chỉnh sửa thông tin nhân viên"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                                            title="Xóa nhân viên"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    {searchTerm ? "Không tìm thấy kết quả phù hợp" : "Không có dữ liệu"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeList;
