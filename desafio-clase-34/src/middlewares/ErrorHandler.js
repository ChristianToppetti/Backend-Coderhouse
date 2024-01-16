import { ErrorEnums } from "../utils/CustomError.js"

export default (error, req, res, next) => {
    req.logger.error(error)
    let code
    switch (error.code) {
        case ErrorEnums.UNKNOWN_ERROR:
            code = 500
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
            break;
        case ErrorEnums.CONFLICT_ERROR:
            code = 409
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