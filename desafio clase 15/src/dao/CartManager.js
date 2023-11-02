import CartModel from './models/cart.model.js'
import { Exception } from '../utils.js'

class CartManager {
	static async getCarts() {
		return await CartModel.find()
	}
	static async addCart(cart) {
		const result = await CartModel.create(cart)
		console.log(result)
		return result
    }
	static async updateCart(id, products) {
		if (!await CartModel.updateOne({_id: id}, {products})) {
			throw new Exception(`Cart with id "${id}" not found`)
		}
		
		return await CartModel.findOne({_id: id})
	}
	static async getCartById(id) {
		try {
			return await CartModel.findOne({_id: id})
		} 
		catch (error) {
			throw new Exception(`Cart with id "${id}" not found`, 404)
		}
	}
}

export default CartManager