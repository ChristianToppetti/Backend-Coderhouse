import UserDao from "../dao/user.dao.js"
import CartService from "./cart.services.js"
import { UserDto } from "../dao/dto/user.dto.js"
import { CustomError, ErrorCause, ErrorEnums } from '../utils/CustomError.js'

class UserService {
    static async addUser(user) {
        const newCart = await CartService.addNewCart({})
        return await UserDao.create(new UserDto(user, newCart))
    }

    static async getByEmail(email) {
        let user = await UserDao.get({ email: email })
        if(!user) {
            return false
        }
        
        return user
	}

    static async getById(id) {
        return await UserDao.get({ _id:id })
    }

    static async getByCart(cid) {
        return await UserDao.get({ cart: cid })
    }

    static async updatePassword(id, password) {
        try {
            return await UserDao.update(id, { "$set": { password: password} })
        }
        catch (error) {
            throw CustomError.createError({
				name: 'Error updating password',
				cause: ErrorCause.userNotFound(id),
				message: `User not found`,
				code: ErrorEnums.DATA_BASE_ERROR
			})
        }
    }

    static async updateRole(id, role) {
        if(role != "admin" && role != "premium" && role != "user") {
            throw CustomError.createError({
                name: 'Error updating role',
                cause: ErrorCause.invalidRole(role),
                message: `Invalid role`,
                code: ErrorEnums.INVALID_PARAMS_ERROR
            })
        }

        const user = await UserService.getById(id)

        if(!user) {
            throw CustomError.createError({
                name: 'Error updating role',
                cause: ErrorCause.userNotFound(id),
                message: `User not found`,
                code: ErrorEnums.DATA_BASE_ERROR
            })
        }
        return await UserDao.update(id, { "$set": { role} })
    }
}

export default UserService