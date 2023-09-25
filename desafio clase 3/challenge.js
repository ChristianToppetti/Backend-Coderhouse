class ProductManager {
    constructor() {
		this.products = []
    }
	validateProps({title, description, price, thumbnail, code, stock}) {
		return (title && description && price && thumbnail && code && stock)
	}

    addProduct(product) {
		if(this.products.find(e => e.code === product.code)) {
			console.log(`addProduct: Error, ya existe un producto con el id: "${product.code}"`)
			return
		}
		if(!this.validateProps(product)) {
			console.log(`addProduct: Error, todos los campos son obligatorios`)
			return
		}

		product.setId(this.products.length + 1)
		this.products.push(product)


		console.log(`addProduct: Producto "${product.title}" (id:${product.code}), agregado con exito.`)
    }
	getProducts() {
		return this.products
	}
	getProductById(id) {
		return this.products.find(e => e.id === id)
	}
}

class Product {
	constructor(title, description, price, thumbnail, code, stock) {
		this.title = title
		this.description = description
		this.price = price
		this.thumbnail = thumbnail
		this.code = code
		this.stock = stock
		this.id = null
	}
	setId(id) {
		this.id = id
	}
}

function start() {
	let productManager = new ProductManager()

	productManager.addProduct(new Product("Prod 1", "Descripcion del producto 1", 111.1, "./thumbnail1.webp", "0001", 11))
	productManager.addProduct(new Product("Prod 1", "Descripcion del producto 1", 111.1, "./thumbnail1.webp", "0001", 11))
	productManager.addProduct(new Product("Prod 2", "Descripcion del producto 2", 222.2, "./thumbnail2.webp", "0002", 22))
	productManager.addProduct(new Product("Prod 3", "Descripcion del producto 3", 333.3, "./thumbnail3.webp", "0003", 33))
	productManager.addProduct(new Product("Prod 4", "", 333.3, "./thumbnail3.webp", "0004", 44))

	foundProducts = productManager.getProducts()
	console.log(`start: Todos los productos (${foundProducts.length}): ${foundProducts}`)

	foundProduct = productManager.getProductById(2)
	console.log(`start: Producto con el id 2: ${foundProduct ? foundProduct.title : "Not found"}`)

	foundProduct = productManager.getProductById(4)
	console.log(`start: Producto con el id 4: ${foundProduct ? foundProduct.title : "Not found"}`)
}

start()