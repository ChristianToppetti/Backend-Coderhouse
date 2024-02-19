import CartModel from './models/cart.model.js'

class CartDao {
    static async add(cart) {
        return await CartModel.create(cart)
    }

	static async get(criteria = {}) {
		return await CartModel.findOne(criteria)
	}

	static async getById(id) {
		return await CartModel.findOne({_id: id})
	}

    static async update(id, products) {
		return await CartModel.updateOne({_id: id}, {products})
	}

	static async updateFields(id, fields) {
		return await CartModel.updateOne({_id: id}, { ...fields })
	}

	static async delete(id) {
		await CartModel.deleteOne({_id: id})
	}
}

export default CartDao