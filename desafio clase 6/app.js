const express = require('express')
const fs = require('fs')

const filePath = './db.json'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    const { limit } = req.query
    let productManager = new ProductManager(filePath)
    const products = await productManager.getProducts()

    if (!limit) {
        res.json(products)
        return
    }

    slicedProducts = products.slice(0, limit)

    res.json(slicedProducts)
    return
})

app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params
    let productManager = new ProductManager(filePath)
    const product = await productManager.getProductById(pid)

    if (!product) {
        res.send('Producto no encontrado')
        return
    }
    res.json(product)
})

app.listen(8080, () => {
    console.log('Servidor corriendo en el puerto 8080') 
})

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
		return products.find(e => e.id === parseInt(id))
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