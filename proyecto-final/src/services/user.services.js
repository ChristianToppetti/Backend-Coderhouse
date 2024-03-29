import UserDao from "../dao/user.dao.js"
import CartService from "./cart.services.js"
import EmailService from "./email.services.js"
import { UserDto, FrontUser } from "../dao/dto/user.dto.js"
import { CustomError, ErrorCause, ErrorEnums } from '../utils/CustomError.js'

class UserService {
    static async addUser(user) {
        const newCart = await CartService.addNewCart({})
        return await UserDao.create(new UserDto(user, newCart))
    }

    static async addDocument(uid, name, path) {
        const doc = {
            name,
            reference: path
        }

        return await UserDao.update(uid, { "$push": { documents: doc } })
    }

    static async update(id, options) {
        return await UserModel.updateOne({_id: id}, { ...options })
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
        try {
            return await UserDao.get({ cart: cid })
        }
        catch (error) {
            throw CustomError.createError({
                name: 'Error getting user by cart',
                cause: ErrorCause.userNotFound(cid),
                message: `Cart not found`,
                code: ErrorEnums.DATA_BASE_ERROR
            })
        }
    }

    static async getAll(allData = false) {
        const users = await UserDao.getAll()

        if(allData) {
            return users
        }
        
        return users.map(user => new FrontUser(user))    
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

    static async updateDate(id) {
        return await UserDao.update(id, { "$set": { last_connection: Date.now() } })
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
        return await UserDao.update(id, { "$set": { role } })
    }

    static async deleteInactiveUsers(inactiveDays) {
        const allUsers = await UserService.getAll(true)
        const usersToDelete = allUsers.filter(user => Date.now() - 1000 * 60 * 60 * 24 * inactiveDays < Date.parse(user.last_connection))
        
        usersToDelete.forEach(async user => {
            await CartService.deleteCart(user.cart)
            await UserDao.delete(user._id)
            await EmailService.sendEmail(user.email, `Despedite de tu cuenta`, `Su cuenta ha sido eliminada por inactividad`)
        })
    }

    static async deleteUser(id) {
        return UserDao.delete(id)
    }
}

export default UserService