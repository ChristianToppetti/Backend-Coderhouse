export class TicketDto {
    constructor(user) {
        this.code = Date.now()
        this.ammount = user.cart.products.reduce( (total, {product, quantity}) => total + (product.price * quantity), 0)
        this.purchaser = user._id
        this.products = user.cart.products.map(({product, quantity}) => {
            return { pid: product._id, quantity, stock: product.stock }
        })
    }
}