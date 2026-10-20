
import * as yup from "yup";

const registerSchema = yup.object({
    username: yup.string()
        .trim()
        .required("Username is required")
        .min(3, "Username must contain at least 3 characters"),

    email: yup.string()
        .trim()
        .required("Email is required")
        .email("Please enter a valid email address"),

    password: yup.string()
        .required("Password is required")
        .min(8, "Password must contain at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
});

export default registerSchema;
