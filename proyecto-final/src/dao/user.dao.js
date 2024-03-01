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
            role,
            last_connection: Date.now()
        })
    }
    
    static async get(criteria = {}) {
        let result = await UserModel.findOne(criteria)
        return result?.populate({
            path: 'cart',
            populate: { path: 'products.product' }
        })
    }

    static async getAll() {
        return await UserModel.find({})
    }

    static async update(id, options) {
        return await UserModel.updateOne({_id: id}, { ...options })
    }

    static async delete(id) {
        return await UserModel.deleteOne({_id: id})
    }
}

export default UserDao