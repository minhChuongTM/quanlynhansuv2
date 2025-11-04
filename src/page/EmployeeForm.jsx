import { useConfirm } from "material-ui-confirm";
import { useDispatch, useSelector } from "react-redux";
import { DEPARTMENTS, employeeSchema, POSITIONS, validateWithJoi } from "../utils/employeeSchema";
import { addEmployee, editEmployee, selectEmployeeList, selectLoading } from "../redux/slice/employeeSlice";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import "./style.css"

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
        <div>
            <div className="form-content">
                <h2
                    style={{
                        marginBottom: "30px",
                        color: "#333",
                        borderBottom: "2px solid #4CAF50",
                        paddingBottom: "10px",
                    }}
                >
                    {employeeFind ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"}
                </h2>
                <Formik
                    initialValues={initialValues}
                    validate={validateWithJoi(employeeSchema)}
                    onSubmit={handleFormSubmit}
                    enableReinitialize
                >
                    {({ errors, touched, isSubmitting }) => (
                        <>
                            <Form>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="fullName">Họ và tên *</label>
                                        <Field
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            placeholder="Nhập họ và tên"
                                            className={errors.fullName && touched.fullName ? "error-field" : ""}
                                        />
                                        <ErrorMessage name="fullName" component="div" className="error-message" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <Field
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="Nhập email"
                                            className={errors.email && touched.email ? "error-field" : ""}
                                        />
                                        <ErrorMessage name="email" component="div" className="error-message" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="department">Phòng ban *</label>
                                        <Field
                                            as="select"
                                            id="department"
                                            name="department"
                                            className={`department-select ${
                                                errors.department && touched.department ? "error-field" : ""
                                            }`}
                                        >
                                            <option value="">-- Chọn phòng ban --</option>
                                            {DEPARTMENTS.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="department" component="div" className="error-message" />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="position">Chức vụ *</label>
                                        <Field
                                            as="select"
                                            id="position"
                                            name="position"
                                            className={`position-select ${
                                                errors.position && touched.position ? "error-field" : ""
                                            }`}
                                        >
                                            <option value="">-- Chọn chức vụ --</option>
                                            {POSITIONS.map((pos) => (
                                                <option key={pos} value={pos}>
                                                    {pos}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="position" component="div" className="error-message" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="startDate">Ngày vào làm *</label>
                                        <Field
                                            type="date"
                                            id="startDate"
                                            name="startDate"
                                            className={errors.startDate && touched.startDate ? "error-field" : ""}
                                        />
                                        <ErrorMessage name="startDate" component="div" className="error-message" />
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn btn-cancel" onClick={() => onClose()}>
                                        Hủy
                                    </button>
                                    <button type="submit" className="btn btn-submit" disabled={loading || isSubmitting}>
                                        {loading || isSubmitting ? "Đang xử lý..." : employeeFind ? "Cập nhật" : "Thêm"}
                                    </button>
                                </div>
                            </Form>
                        </>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default EmployeeForm;
