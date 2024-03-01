import UserService from "../services/user.services.js"

class UserController {
    static async addUser(user) {
        return await UserService.addUser(user)
    }

    static async addDocument(uid, name, path) {
        return await UserService.addDocument(uid, name, path)
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

    static async getUserByEmail(email) {
        return await UserService.getByEmail(email)
    }

    static async getAllUsers(allData = false) {
        return await UserService.getAll(allData)
    }

    static async updateRole(id, role) {
        return await UserService.updateRole(id, role)
    }

    static async updateUserPassword(id, password) {
        return await UserService.updatePassword(id, password)
    }

    static async updateConnectionDate(id) {
        return await UserService.updateDate(id)
    }

    static async deleteInactiveUsers(inactiveDays) {
        return await UserService.deleteInactiveUsers(inactiveDays)
    }

    static async deleteUser(id) {
        return await UserService.deleteUser(id)
    }
}

export default UserController