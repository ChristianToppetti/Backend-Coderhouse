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
    static productNotFound(pid) {
        return `Product not found with id: ${product}`
    }
    static cartNotFound(cid) {
        return `Cart not found with id: ${cart}`
    }
    static productNotInCart(pid, cid) {
        return `Product with id: ${pid} not found in cart with id: ${cid}`
    }
    static invalidPage(page, totalPages) {
        return `Page ${page} not found. Total pages: ${totalPages}`
    }
    static productAlreadyExists(code) {
        return `Product with code: ${code} already exists`
    }
    static creatingProduct({ title, code, price, description, status, stock, thumbnail, category }) {
        return `
        All fields are required.
        List of required fields:
        - title (String): received "${title}"
        - code (String): received "${code}"
        - price (Number): received "${price}"
        - description (String): received "${description}"
        - status (Boolean): received "${status}"
        - stock (Number): received "${stock}"
        - thumbnail (String): received "${thumbnail}"
        - category (String): received "${category}"
        `
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
    CONFLICT_ERROR: 7
}