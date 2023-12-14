import UserDao from "../dao/user.dao.js"
import CartService from "./cart.services.js"

class UserService {
    static async addUser(user) {
        const newUser = {
            ...user,
            cart: await CartService.addNewCart({})
        }
        return await UserDao.create(newUser)
    }

    static async getByEmail(email) {
        let user = await UserDao.get({ email: email })
        return user.populate('cart')
	}

    static async getById(id) {
        return await UserDao.get({ _id:id })
    }
}

export default UserService