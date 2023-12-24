export class TicketDto {
    constructor(user) {
        this.code = Date.now()
        this.ammount = user.products.reduce( (total, product) => total + product.price, 0)
        this.purchaser = user._id
        this.products = user.products.map(product => {product._id, product.quantity})
    }
}