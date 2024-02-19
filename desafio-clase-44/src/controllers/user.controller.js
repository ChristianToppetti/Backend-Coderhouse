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

    static async updateRole(id, role) {
        return await UserService.updateRole(id, role)
    }

    static async getAllUsers() {
        return await UserService.getAll()
    }

    static async updateConnectionDate(id) {
        return await UserService.updateDate(id)
    }

    static async addDocument(uid, name, path) {
        return await UserService.addDocument(uid, name, path)
    }
}

export default UserController