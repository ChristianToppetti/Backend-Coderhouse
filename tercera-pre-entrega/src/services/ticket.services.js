import TicketDao from "../dao/ticket.dao.js"
import CartService from "../services/cart.services.js"
import ProductService from "../services/product.services.js"
import UserService from "../services/user.services.js"
import { Exception } from "../utils.js"

const updateStock = async (products) => {
    products.forEach(async (product) => await ProductService.reduceProductStock(product._id, product.quantity))
}

const updateCart = async (uid, products) => {
    const cartId = await UserService.getById(uid).cart
    await CartService.updateCart(cartId, products)
}

class TicketService {
    static async addTicket(ticket) {
        const failedProducts = []

        ticket.products = ticket.products.map(async (product) => {
            const prod = await ProductService.getProductById(product._id)
            if (prod.stock >= product.quantity) {
                return product
            }
            failedProducts.push(product)
        })

        try {
            await TicketDao.add(ticket)
            await updateStock(ticket.products)
            await updateCart(ticket.purchaser, failedProducts)
            return await TicketDao.get({code: ticket.code})
        } catch (error) {
            throw new Exception(error.message, 500)
        }
    }

    static async getByUser(user) {

	}

    static async getByCode(code) {
        return await TicketDao.get({code})
    }
}

export default TicketService