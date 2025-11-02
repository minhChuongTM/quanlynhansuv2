import { useConfirm } from "material-ui-confirm";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEPARTMENTS, employeeSchema, POSITIONS, validateWithJoi } from "../utils/employeeSchema";
import { addEmployee, editEmployee, selectLoading } from "../redux/store/employeeSlice";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik } from "formik";

function EmployeeForm({ employee, onClose }) {
    const dispatch = useDispatch();
    const loading = useSelector(selectLoading);
    const confirm = useConfirm();

    const initialValues = {
        fullName: employee?.fullName || "",
        email: employee?.email || "",
        department: DEPARTMENTS.includes(employee?.department) ? employee.department : "",
        position: POSITIONS.includes(employee?.position) ? employee.position : "",
        startDate: employee?.startDate || "",
    };
    const handleFormSubmit = async (values, { setSubmitting }) => {
        console.log(values);
        try {
            if (employee) {
                await confirm({
                    title: "Xác nhận cập nhật",
                    description: `Bạn có chắc chắn muốn cập nhật thông tin nhân viên "${values.fullName}"?`,
                    confirmationText: "Cập nhật",
                    cancellationText: "Hủy",
                });

                const result = await dispatch(editEmployee({ ...values, id: employee.id }).unwrap());
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

                const result = await dispatch(addEmployee(values).unwrap());
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
        } catch {
            console.log("lỗi");
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
                    {employee ? "Chỉnh sửa thông tin nhân viên" : "Thêm nhân viên mới"}
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
                                        {loading || isSubmitting ? "Đang xử lý..." : employee ? "Cập nhật" : "Thêm"}
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
