import CartService from '../services/cart.services.js'

class CartController {
    static async addCart(cart) {
        return await CartService.addCart(cart)
    }

	static async getCarts() {
        return await CartService.getCarts()
	}
    
    static async getCartById(id, populate=false) {
        return await CartService.getCartById(id, populate)
    }
    
	static async updateCart(id, products) {
        return await CartService.updateCart(id, products)
	}


	static async addProductToCart(cid, pid, quantity=null) {
        return await CartService.addProductToCart(cid, pid, quantity)
	}

	static async deleteProductFromCart(cid, pid) {
        return await CartService.deleteProductFromCart(cid, pid)
    }
}

export default CartController