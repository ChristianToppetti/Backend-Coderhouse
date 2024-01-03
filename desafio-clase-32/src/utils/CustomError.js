export class CustomError {
    static createError({ name = 'Error', cause, message, code = 1 }) {
        const error = new Error(message)
        error.name = name
        error.cause = cause
        error.code = code
        return error
    }
}

export class ErrorCause {
    static creatingUser({ first_name, last_name, email, age, password }) {
        return `
        All fields are required.
        List of required fields:
        - first_name (String): received "${first_name}"
        - last_name (String): received "${last_name}"
        - email (String): received "${email}"
        - age (Number): received "${age}"
        - password (String): received "${password}"
        `
    }
    static emailTaken(email) {
        return `Email "${email}" already taken.`
    }
    static invalidCredentials() {
        return "Invalid email or password."
    }
    static userNotFound(user) {
        return `User not found with identifier: ${user}`
    }
    static githubAuthError(error) {
        return `Error: ${error}`
    }
}

export const ErrorEnums = {
    UNKNOWN_ERROR: 0,
    ROUTING_ERROR: 1,
    INVALID_TYPE_ERROR: 2,
    DATA_BASE_ERROR: 3,
    INVALID_PARAMS_ERROR: 4,
    BAD_REQUEST_ERROR: 5,
    UNAUTHORIZED_ERROR: 6,
}