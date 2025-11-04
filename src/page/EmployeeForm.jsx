import { useConfirm } from "material-ui-confirm";
import { useDispatch, useSelector } from "react-redux";
import { DEPARTMENTS, employeeSchema, POSITIONS, validateWithJoi } from "../utils/employeeSchema";
import { addEmployee, editEmployee, selectEmployeeList, selectLoading } from "../redux/slice/employeeSlice";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import "./style.css";

function EmployeeForm({ onClose }) {
    const dispatch = useDispatch(); // useDispatch() dùng để gửi các action đến Redux store
    const loading = useSelector(selectLoading); // useSelector() dùng để truy cập trạng thái từ Redux store. selectLoading là một selector function được định nghĩa trong employeeSlice.js để lấy trạng thái loading từ slice nhân viên.
    const confirm = useConfirm(); // Sử dụng hook useConfirm để hiển thị hộp thoại xác nhận
    const { id } = useParams(); // Lấy id từ URL
    const employees = useSelector(selectEmployeeList); // Lấy danh sách nhân viên từ Redux store

    // Nếu có id trên URL, tìm nhân viên để sửa, nếu không thì là thêm mới
    const employeeFind = employees?.find((emp) => emp.id === id); // Tìm nhân viên theo id

    const initialValues = {
        fullName: employeeFind?.fullName || "",
        email: employeeFind?.email || "",
        department: DEPARTMENTS.includes(employeeFind?.department) ? employeeFind.department : "",
        position: POSITIONS.includes(employeeFind?.position) ? employeeFind.position : "",
        startDate: employeeFind?.startDate || "",
    };
    console.log("employeeFind:", employeeFind);
    const handleFormSubmit = async (values, { setSubmitting }) => {
        console.log(values);
        try {
            if (employeeFind) {
                await confirm({
                    title: "Xác nhận cập nhật",
                    description: `Bạn có chắc chắn muốn cập nhật thông tin nhân viên "${values.fullName}"?`,
                    confirmationText: "Cập nhật",
                    cancellationText: "Hủy",
                });

                const result = await dispatch(editEmployee({ ...values, id: employeeFind.id }).unwrap());
                setSubmitting(false);

                if (result.meta.requestStatus === "fulfilled") {
                    toast.success("Cập nhật thông tin nhân viên thành công!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    onClose();
                } else {
                    toast.error("Có lỗi xảy ra khi cập nhật thông tin nhân viên!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            } else {
                await confirm({
                    title: "Xác nhận thêm mới",
                    description: `Bạn có chắc chắn muốn thêm nhân viên "${values.fullName}"?`,
                    confirmationText: "Thêm",
                    cancellationText: "Hủy",
                });

                const result = await dispatch(addEmployee(values)); //dùng để gửi acstion thêm nhân viên mới
                setSubmitting(false);

                if (result.meta.requestStatus === "fulfilled") {
                    toast.success("Thêm nhân viên mới thành công!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                    onClose();
                } else {
                    toast.error("Có lỗi xảy ra khi thêm nhân viên!", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            }
        } catch (error) {
            console.log(error);
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-start">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-green-500 pb-3 mb-6">
                    {employeeFind ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"}
                </h2>

                <Formik
                    initialValues={initialValues}
                    validate={validateWithJoi(employeeSchema)}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form className="space-y-6">
                            {/* Họ và tên + Email */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên *
                                    </label>
                                    <Field
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Nhập họ và tên"
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            errors.fullName && touched.fullName ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    <ErrorMessage
                                        name="fullName"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Nhập email"
                                        className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            errors.email && touched.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                                </div>
                            </div>

                            {/* Phòng ban + Chức vụ */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="department"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Phòng ban *
                                    </label>
                                    <Field
                                        as="select"
                                        id="department"
                                        name="department"
                                        className={`w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            errors.department && touched.department
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">-- Chọn phòng ban --</option>
                                        {DEPARTMENTS.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="department"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                                        Chức vụ *
                                    </label>
                                    <Field
                                        as="select"
                                        id="position"
                                        name="position"
                                        className={`w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                            errors.position && touched.position ? "border-red-500" : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">-- Chọn chức vụ --</option>
                                        {POSITIONS.map((pos) => (
                                            <option key={pos} value={pos}>
                                                {pos}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="position"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            {/* Ngày vào làm */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày vào làm *
                                </label>
                                <Field
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                        errors.startDate && touched.startDate ? "border-red-500" : "border-gray-300"
                                    }`}
                                />
                                <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium transition"
                                    onClick={() => onClose()}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || isSubmitting}
                                    className={`px-5 py-2 rounded-lg text-white font-medium transition ${
                                        loading || isSubmitting
                                            ? "bg-green-300 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                    }`}
                                >
                                    {loading || isSubmitting ? "Đang xử lý..." : employeeFind ? "Cập nhật" : "Thêm"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default EmployeeForm;
