import UserModel from "./models/user.model.js"

class UserDao {
    static async create({first_name, last_name, email, age, password, cart, role}) {
        return UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password,
            cart,
            role
        })
    }
    
    static async get(criteria = {}) {
        return await UserModel.findOne(criteria)
    }

    static async getById(id) {
        return await UserModel.findOne({_id: id})
    }

    static async update(id, user) {
        return await UserModel.updateOne({_id: id}, user)
    }

    static async delete(id) {
        return await UserModel.deleteOne({_id: id})
    }
}

export default UserDao