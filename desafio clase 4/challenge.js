const fs = require('fs')

const filePath = './db.json'

class ProductManager {
    constructor(path) {
		this.dbPath = path
    }
	validateProps({title, description, price, thumbnail, code, stock}) {
		return (title && description && price && thumbnail && code && stock)
	}
	async deleteProduct(id) {
		let productsDb = await this.loadDb()
		let index = productsDb.findIndex(e => e.id === id)
		if (index !== -1) {
			productsDb.splice(index, 1)
			await this.saveDb(productsDb)
			return console.log(`deleteProduct: Producto id:${id}, borrado con exito.`)
		}
		return console.warn(`deleteProduct: Error, no se encontro el producto con el id: "${id}"`)
	}
	async updateProduct(id, {title, description, price, thumbnail, code, stock}) {
		let productsDb = await this.loadDb()
		let index = productsDb.findIndex(e => e.id === id)

		if (index !== -1) {
			let product = productsDb[index]

			title && (product.title = title)
			description && (product.description = description)
			price && (product.price = price)
			thumbnail && (product.thumbnail = thumbnail)
			code && (product.code = code)
			stock && (product.stock = stock)

	
			productsDb[index] = product

			await this.saveDb(productsDb)
			return console.log(`updateProduct: Producto id:${productsDb[index].id}, updateado con exito.`)
		}
		return console.warn(`updateProduct: Error, no se encontro el producto con el id: "${id}"`)
	}
	async getProducts() {
		return await this.loadDb()
	}
	async getProductById(id) {
		let products = await this.loadDb()
		return products.find(e => e.id === id)
	}
	async addProduct(product) {
		if(!this.validateProps(product)) {
			console.warn(`addProduct: Error, todos los campos son obligatorios`)
			return
		}

		let productsDb = await this.loadDb()
		
		if(productsDb.find(e => e.code === product.code)) {
			console.warn(`addProduct: Error, ya existe un producto con el id: "${product.code}"`)
			return
		}

		product.setId(productsDb.length + 1)
		productsDb.push(product)
		await this.saveDb(productsDb)

		console.log(`addProduct: Producto "${product.title}" (id:${product.code}), agregado con exito.`)
    }
	async saveDb(data) {
		const newDb = JSON.stringify(data, null, '\t')
		try {
			await fs.promises.writeFile(this.dbPath, newDb)
		} 
		catch (error) {
			let err = `El archivo ${this.dbPath} no pudo ser escrito. ${error}`
			throw new Error(err)
		}
	}
	async loadDb() {
		let db = []
		try {
			db = await fs.promises.readFile(this.dbPath, 'utf-8')
		} 
		catch (error) {
			console.warn(`El archivo ${this.dbPath} no pudo ser leido.`)
			return db
		}

		try {
			return JSON.parse(db)
		} 
		catch (error) {
			let err = `El archivo ${this.dbPath} no tiene un formato JSON válido.`
			throw new Error(err)
		}
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

async function start() {
	let productManager = new ProductManager(filePath)

	await productManager.addProduct(new Product("Prod 1", "Descripcion del producto 1", 111.1, "./thumbnail1.webp", "0001", 11))
	await productManager.addProduct(new Product("Prod 1", "Descripcion del producto 1", 111.1, "./thumbnail1.webp", "0001", 11))
	await productManager.addProduct(new Product("Prod 2", "Descripcion del producto 2", 222.2, "./thumbnail2.webp", "0002", 22))
	await productManager.addProduct(new Product("Prod 3", "Descripcion del producto 3", 333.3, "./thumbnail3.webp", "0003", 33))
	await productManager.addProduct(new Product("Prod 4", "", 444.4, "./thumbnail3.webp", "0004", 44))
	await productManager.addProduct(new Product("Prod 4", "Producto a borrar", 444.4, "./thumbnail3.webp", "0004", 44))

	foundProducts = await productManager.getProducts()
	console.log(`start: Todos los productos (${foundProducts.length}): ${foundProducts}`)

	foundProduct = await productManager.getProductById(2)
	console.log(`start: Producto con el id 2: ${foundProduct ? foundProduct.title : "Not found"} | Objeto: ${foundProduct}`)

	foundProduct = await productManager.getProductById(4)
	console.log(`start: Producto con el id 4: ${foundProduct ? foundProduct.title : "Not found"}`)

	await productManager.updateProduct(3, {title:"TITULO UPDATEADO", stock: 8888888})
	fp = await productManager.getProductById(3)
	console.log(`start: Producto 3: ${fp.title} | ${fp.description} | ${fp.price} | ${fp.code} | ${fp.stock}`)

	await productManager.updateProduct(555555555, {title:"TEST ERROR UPDATE"})

	await productManager.updateProduct(3, new Product("Titulo", "Test update total", 999.1, "./update.webp", "0003", 1))
	fp = await productManager.getProductById(3)
	console.log(`start: Producto 3: ${fp.title} | ${fp.description} | ${fp.price} | ${fp.code} | ${fp.stock}`)

	await productManager.deleteProduct(4)
	await productManager.deleteProduct(44444)
}

start()