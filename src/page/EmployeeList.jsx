import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getEmployees, selectEmployeeList, removeEmployee, selectLoading } from "../redux/slice/employeeSlice";
import { useConfirm } from "material-ui-confirm";
import { toast } from "react-toastify";
// import './Employee.css';

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
        <div className="employee-list-container">
            <div className="header-section">
                <h2>Danh sách nhân viên</h2>
              
            </div>

            <div className="filter-section">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button className="clear-search" onClick={() => setSearchTerm("")} title="Xóa tìm kiếm">
                            ✕
                        </button>
                    )}
                </div>
                <div className="department-box">
                    <label htmlFor="department">Phòng ban:</label>
                    <select
                        id="department"
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="department-select"
                    >
                        <option value="all">Tất cả</option>
                        {DEPARTMENTS.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="sort-box">
                    <label htmlFor="sortOrder">Sắp xếp:</label>
                    <select
                        id="sortOrder"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                    >
                        <option value="desc">Mới nhất</option>
                        <option value="asc">Cũ nhất</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>Phòng ban</th>
                            <th>Chức vụ</th>
                            <th>Ngày vào làm</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedEmployees.length > 0 ? (
                            filteredAndSortedEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.id}</td>
                                    <td>{employee.fullName}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.department}</td>
                                    <td>{employee.position}</td>
                                    <td>{new Date(employee.startDate).toLocaleDateString("vi-VN")}</td>
                                    <td>
                                        <button
                                            className="btn btn-edit"
                                            onClick={() => handleEdit(employee)}
                                            title="Chỉnh sửa thông tin nhân viên"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-delete"
                                            onClick={() => handleDelete(employee)}
                                            title="Xóa nhân viên"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">
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
