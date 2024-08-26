import { checkSchema } from 'express-validator'

const postValidationSchema = () => {
    return checkSchema({
        creator: {
            notEmpty: {
                errorMessage: "This field is required"
            },
            isLength: {
                options: { max: 255 },
                errorMessage: "Must be less than 255 character"
            }
        },
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
    })
}

export default postValidationSchema