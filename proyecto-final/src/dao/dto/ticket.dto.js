export class TicketDto {
    constructor(user) {
        this.code = Date.now()
        this.amount = user.cart.products.reduce( (total, {product, quantity}) => total + (product.price * quantity), 0)
        this.purchaser = user._id

        const filteredProducts = user.cart.products.filter(({product, quantity}) => product.stock >= quantity)
        this.products = filteredProducts.map(({product, quantity}) => {
            return { 
                pid: product._id,
                title: product.title,
                price: product.price,
                quantity, 
                stock: product.stock 
            }
        })
    }
}