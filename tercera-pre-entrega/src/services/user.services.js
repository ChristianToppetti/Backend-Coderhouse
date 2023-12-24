import UserDao from "../dao/user.dao.js"
import CartService from "../../services/cart.services.js"
import { UserDto } from "../dao/dto/user.dto.js"

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
        
        return user.populate('cart')
	}

    static async getById(id) {
        return await UserDao.get({ _id:id })
    }

    static async getByCart(cid) {
        return await UserDao.get({ cart: cid })
    }
}

export default UserService