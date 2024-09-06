import { checkSchema } from 'express-validator'

const postValidationSchema = () => {
    return checkSchema({
        title: {
            notEmpty: {
                errorMessage: "This field is required"
            },
            isLength: {
                options: { max: 255 },
                errorMessage: "Must be less than 255 character"
            }
        },
        message: {
            notEmpty: {
                errorMessage: "This field is required"
            }
        },
        tags: {
            notEmpty: {
                errorMessage: "This field is required"
            }
        },
    })
}

const loginValidationSchema = () => {
    return checkSchema({
        email: {
            notEmpty: {
                errorMessage: "This field is required"
            },
            isEmail: {
                errorMessage: "Invalid email address"
            }
        },
        password: {
            notEmpty: {
                errorMessage: "This field is required"
            }
        }
    })
}

const registerValidationSchema = () => {
    return checkSchema({
        first_name: {
            notEmpty: {
                errorMessage: "This field is required"
            },
            isLength: {
                options: { max: 255 },
                errorMessage: "Must be less than 255 character"
            }
        },
        last_name: {
            notEmpty: {
                errorMessage: "This field is required"
            },
            isLength: {
                options: { max: 255 },
                errorMessage: "Must be less than 255 character"
            }
        },
        email: {
            notEmpty: {
                errorMessage: "This field is required"
            },
            isEmail: {
                errorMessage: "Invalid email address"
            }
        },
        password: {
            notEmpty: {
                errorMessage: "This field is required"
            },
            isLength: {
                options: { min: 8 },
                errorMessage: "Password must be at least 8 characters"
            },
            isLength: {
                options: { max: 255 },
                errorMessage: "Must be less than 255 character"
            }
        }
    })
}

export {
    postValidationSchema,
    loginValidationSchema,
    registerValidationSchema
}