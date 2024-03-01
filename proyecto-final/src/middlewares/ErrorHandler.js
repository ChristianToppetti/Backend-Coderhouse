import { ErrorEnums } from "../utils/CustomError.js"

export default (error, req, res, next) => {
    console.log(error)
    req.logger.error(`Name: "${error.name}", message: "${error.message}", cause: "${error.cause}", code: "${error.code}"`)
    let code
    switch (error.code) {
        case ErrorEnums.UNKNOWN_ERROR:
            code = 500
            break
        case ErrorEnums.BAD_REQUEST_ERROR:
            code = 400
            break
        case ErrorEnums.INVALID_PARAMS_ERROR:
            code = 401
            break
        case ErrorEnums.DATA_BASE_ERROR:
            code = 500
            break
        case ErrorEnums.ROUTING_ERROR:
            code = 404
            break
        case ErrorEnums.CONFLICT_ERROR:
            code = 409
            break
        case ErrorEnums.FORBIDDEN_ERROR:
            code = 403
            break
        case ErrorEnums.UNAUTHORIZED_ERROR:
            code = 401
            break
        default:
            res.json({status: 'error', message: "Unhandled error."})
            return
    }
    
    res.status(code).json({ 
        status: 'error', 
        message: error.message,
        cause: error.cause && error.cause
    })
}