import CartDao from '../dao/cart.dao.js'
import ProductService from './product.services.js'
import { Exception } from '../utils/utils.js'

class CartService {
    static async addCart(cart) {
		return await CartDao.add(cart)
    }

	static async addNewCart() {
		return await CartDao.add({})
	}

	static async getCarts() {
		return await CartDao.get()
	}
	
	static async updateCart(id, products) {
		try {
			const result = await CartDao.update(id, products)

			if(result.matchedCount == 0) {
				throw new Error()
			}

			return await CartDao.getById(id)
		}
		catch (error) {
			throw new Exception(`Cart with id "${id}" not found`)
		}
	}

	static async getCartById(id, populate=false) {
		try {
			const cart = await CartDao.getById(id)
			if(populate) {
				return await cart.populate('products.product') 
			}
			return cart
		} 
		catch (error) {
			throw new Exception(`Cart with id "${id}" not found`, 404)
		}
	}

	static async addProductToCart(cid, pid, quantity=null) {
		const cart = await CartService.getCartById(cid)
		const validProduct = await ProductService.productExists(pid)
	
		if(validProduct)
		{
			const productIndex = cart.products.findIndex(e => e.product.toString() == pid)

			if(productIndex != -1) {
				quantity? cart.products[productIndex].quantity = quantity : cart.products[productIndex].quantity++
			}
			else {
				cart.products.push({
					product: pid,
					quantity: quantity? quantity : 1
				})
			}

			let result = await CartDao.update(cid, cart.products)
			return result
		}
	
		throw new Exception(`Product with id "${pid}" doesn't exist"`, 404)
	}

	static async deleteProductFromCart(cid, pid) {
		const cart = await CartService.getCartById(cid)		
		const productIndex = cart.products.findIndex(e => e.product.toString() == pid)

		if(productIndex != -1) {			
			cart.products.splice(productIndex, 1)
			return await CartDao.update(cid, cart.products)
		}

		throw new Exception(`Product with id "${pid}" not found in cart with id "${cid}"`, 404)
	}

	static async getAdminCart() {
		return await CartService.getCartById("657afe2e08fb9fd894556a71")    
	}
}

export default CartService