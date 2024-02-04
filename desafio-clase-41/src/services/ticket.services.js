import TicketDao from "../dao/ticket.dao.js"
import CartService from "../services/cart.services.js"
import ProductService from "../services/product.services.js"
import UserService from "../services/user.services.js"
import { CustomError, ErrorCause, ErrorEnums } from '../utils/CustomError.js'

const updateStock = async (products) => {
    products.forEach(async (product) => await ProductService.reduceProductStock(product.pid, product.quantity))
}

const updateCart = async (uid, products) => {
    const user = await UserService.getById(uid)
    const cartId = user.cart._id
    await CartService.updateCart(cartId, products)
}

class TicketService {
    static async addTicket(ticket) {
        const failedProducts = []
        
        ticket.products = ticket.products.filter((product) => {
            if (product.stock >= product.quantity) {
                return {
                    pid: product.pid, 
                    quantity: product.quantity
                }
            }
            failedProducts.push({
                product: product.pid, 
                quantity: product.quantity
            })
        })

        if (ticket.products.length == 0) {
            throw CustomError.createError({
                name: 'Error making purchase',
                cause: ErrorCause.insufficientStock(),
                message: 'Products with stock unavailable',
                code: ErrorEnums.DATA_BASE_ERROR
            })
        }

        await TicketDao.add(ticket)
        await updateStock(ticket.products)
        await updateCart(ticket.purchaser, failedProducts)
        return await TicketDao.get({code: ticket.code})
    }

    static async getByUser(user) {

	}

    static async getByCode(code) {
        return await TicketDao.get({code})
    }
}

export default TicketService