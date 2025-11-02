import Joi from "joi";

export const DEPARTMENTS = [
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

export const POSITIONS = [
    "Software Engineer",
    "Senior Software Engineer",
    "Lead Software Engineer",
    "QA Engineer",
    "Senior QA Engineer",
    "Product Manager",
    "Senior Product Manager",
    "Data Analyst",
    "Senior Data Analyst",
    "DevOps Engineer",
    "Senior DevOps Engineer",
    "HR Specialist",
    "HR Manager",
    "UI/UX Designer",
    "Senior UI/UX Designer",
    "Accountant",
    "Senior Accountant",
    "Sales Executive",
    "Sales Manager",
    "Marketing Manager",
    "Senior Marketing Manager",
];

export const employeeSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).required().messages({
        "string.empty": "Họ và tên là bắt buộc",
        "string.min": "Họ và tên phải có ít nhất 3 ký tự",
        "string.max": "Họ và tên không được vượt quá 100 ký tự",
        "any.required": "Họ và tên là bắt buộc",
    }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": "Email là bắt buộc",
            "string.email": "Email không hợp lệ",
            "any.required": "Email là bắt buộc",
        }),

    department: Joi.string()
        .valid(...DEPARTMENTS)
        .required()
        .messages({
            "string.empty": "Vui lòng chọn phòng ban",
            "any.only": "Phòng ban không hợp lệ",
            "any.required": "Vui lòng chọn phòng ban",
        }),

    position: Joi.string()
        .valid(...POSITIONS)
        .required()
        .messages({
            "string.empty": "Vui lòng chọn chức vụ",
            "any.only": "Chức vụ không hợp lệ",
            "any.required": "Vui lòng chọn chức vụ",
        }),

    startDate: Joi.date().max("now").required().messages({
        "date.base": "Ngày vào làm không hợp lệ",
        "date.max": "Ngày vào làm không được lớn hơn ngày hiện tại",
        "any.required": "Ngày vào làm là bắt buộc",
    }),
   
});

// Helper function để validate và format errors cho Formik
export const validateWithJoi = (schema) => (values) => {
    const { error } = schema.validate(values, { abortEarly: false });

    if (!error) return {};

    const errors = {};
    error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
    });

    return errors;
};
