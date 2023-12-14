import ProductDao from '../dao/product.dao.js'
import { Exception, bsonToObject } from '../utils.js'

class ProductService {
	static async productExists(id) {
		try {
			return await ProductDao.getById(id)
		} 
		catch (error) {
			return false
		}
	}

	static async deleteProduct(id) {
		if (await ProductDao.productExists(id)) {
			await ProductDao.delete(id)
		} else {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
	}

	static async updateProduct(id, options) {
        if(options.status && typeof options.status == 'string') {
            options.status = options.status.toLocaleLowerCase() == 'true'
        } 
            
		if (!await ProductDao.update(id, options)) {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
		return await ProductDao.getProductById(id)
	}

	static async getProducts(limit=10, queryPage=1, querySort=null, queryFilters=null) {
		isNaN(queryPage) && (queryPage = 1)
		isNaN(limit) && (limit = 10)
		limit == 0 && (limit = 9999)

		let query = {}
		let sort = {price: querySort}
		querySort == 'desc' || querySort == 'asc' || (sort = {})

		if(queryFilters) {
			const { status, category } = queryFilters
			if(status && status == 'true' || status == 'false' ) {
				query = {status: status}
			}
			category && (query = { 
				...query, 
				category: category.toLowerCase()
			})
		}

		const result = await ProductDao.get(query, {limit, page:queryPage, sort})

		if(result.page > result.totalPages) {
			throw new Exception(`Page "${page}" not found`, 404)
		}

		result.payload = bsonToObject(result.payload)
		return { 
			status: '201', 
			...result
		}
	}

	static async getProductById(id) {
		try {
			const product = await ProductDao.getById(id)
			return { 
				...product
			}
		}
		catch (error) {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
	}
    
	static async addProduct(productData) {
		try {
			const {  thumbnail } = productData
            const thumbn = thumbnail? thumbnail: "./thumbnail1.webp"

            productData.thumbnail = thumbn
			productData.category = productData.category.toLowerCase()

			await ProductDao.add(productData)
		}
		catch (error) {
			if (error.code === 11000) {
				throw new Exception(`Product with code "${productData.code}" already exists. code must be unique`, 409)
			}

			throw new Exception("Product data is not valid", 400)
		}
    }
}

export default ProductService