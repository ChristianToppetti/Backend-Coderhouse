import UserService from "../services/user.services.js"

class UserController {
    static async addUser(user) {
        return await UserService.addUser(user)
    }

    static async getUser(email) {
        return await UserService.getByEmail(email)
    }

    static async getUserById(id) {
        return await UserService.getById(id)
    }

    static async getUserByCart(cid) {
        return await UserService.getByCart(cid)
    }

}

export default UserController