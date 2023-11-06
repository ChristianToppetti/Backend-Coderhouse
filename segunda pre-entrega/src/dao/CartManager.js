import CartModel from './models/cart.model.js'
import ProductManager from './ProductManager.js'
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
		try {
			await CartModel.updateOne({_id: id}, {products})
			return await CartModel.findOne({_id: id})
		}
		catch (error) {
			throw new Exception(`Cart with id "${id}" not found`)
		}
	}
	static async getCartById(id) {
		try {
			return await CartModel.findOne({_id: id})
		} 
		catch (error) {
			throw new Exception(`Cart with id "${id}" not found`, 404)
		}
	}
	static async addProductToCart(cid, pid, quantity=null) {
		const cart = await CartManager.getCartById(cid)
		const validProduct = await ProductManager.productExists(pid)
	
		if(validProduct)
		{
			const productIndex = cart.products.findIndex(e => e.id == pid)
	
			if(productIndex != -1) {
				if(quantity) {
					cart.products[productIndex].quantity = quantity
				}
				else {	
					cart.products[productIndex].quantity++
				}
			}
			else {
				cart.products.push({
					id: pid,
					quantity: 1
				})
			}

			let result = await CartManager.updateCart(cid, cart.products)
			return result
		}
	
		throw new Exception(`Product with id "${pid}" doesn't exist"`, 404)
	}
	static async deleteProductFromCart(cid, pid) {
		const cart = await CartManager.getCartById(cid)
		const productIndex = cart.products.findIndex(e => e.id == pid)

		if(productIndex != -1) {			
			cart.products.splice(productIndex, 1)
			return await CartManager.updateCart(cid, cart.products)
		}

		throw new Exception(`Product with id "${pid}" not found in cart with id "${cid}"`, 404)
	}
	static async updateCartProduct(cid, pid, quantity) {
		
	}
}

export default CartManager