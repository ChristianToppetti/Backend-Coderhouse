import ProductDao from '../dao/product.dao.js'
import ProductDto from '../dao/dto/product.dto.js'
import { CustomError, ErrorCause, ErrorEnums } from '../utils/CustomError.js'

class ProductService {
	static async productExists(id) {
		try {
			return await ProductDao.getById(id)
		} 
		catch (error) {
			return false
		}
	}

	static async productCodeExists(code) {
		try {
			return await ProductDao.getByCode(code)
		} 
		catch (error) {
			return false
		}
	}

	static async deleteProduct(id) {
		if (await ProductService.productExists(id)) {
			await ProductDao.delete(id)
		} else {
			throw CustomError.createError({
				name: 'Error deleting product',
				cause: ErrorCause.productNotFound(id),
				message: `Product not found`,
				code: ErrorEnums.DATA_BASE_ERROR
			})
		}
	}

	static async updateProduct(id, options) {
        if(options.status && typeof options.status == 'string') {
            options.status = options.status.toLocaleLowerCase() == 'true'
        } 

		if(!await ProductService.productExists(id)) {
			throw CustomError.createError({
				name: 'Error updating product',
				cause: ErrorCause.productNotFound(id),
				message: `Product not found`,
				code: ErrorEnums.DATA_BASE_ERROR
			})
		}

		try {
			if (!await ProductDao.update(id, options)) {
				throw CustomError.createError({
					name: 'Error updating product',
					cause: ErrorCause.productNotFound(id),
					message: `Product not found`,
					code: ErrorEnums.DATA_BASE_ERROR
				})
			}
		}
		catch (error) {
			if (error.code === 11000) {
				throw CustomError.createError({
					name: 'Error updating product',
					cause: ErrorCause.productAlreadyExists(options.code),
					message: `Product code already exists. code must be unique`,
					code: ErrorEnums.CONFLICT_ERROR
				})
			}
			throw error
		}

		return await ProductService.getProductById(id)
	}

	static async reduceProductStock(id, quantity) {
		if (await ProductService.productExists(id)) {
			await ProductDao.update(id, { "$inc": { stock: -quantity } })
		} else {
			throw CustomError.createError({
				name: 'Error updating product stock',
				cause: ErrorCause.productNotFound(id),
				message: `Product not found`,
				code: ErrorEnums.DATA_BASE_ERROR
			})
		}
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
			throw CustomError.createError({
				name: 'Error getting products',
				cause: ErrorCause.invalidPage(page, totalPages),
				message: `Page not found`,
				code: ErrorEnums.ROUTING_ERROR
			})
		}

		return new ProductDto(result)
	}

	static async getProductById(id) {
		try {
			return await ProductDao.getById(id)
		}
		catch (error) {
			throw CustomError.createError({
				name: 'Error getting product',
				cause: ErrorCause.productNotFound(id),
				message: `Product not found`,
				code: ErrorEnums.DATA_BASE_ERROR
			})
		}
	}

	static async getProductByCode(code) {
		try {
			return await ProductDao.getByCode(code)
		}
		catch (error) {
			throw CustomError.createError({
				name: 'Error getting product',
				cause: ErrorCause.productNotFound(code),
				message: `Product not found`,
				code: ErrorEnums.DATA_BASE_ERROR
			})
		}
	}
    
	static async addProduct(productData) {

		const {  thumbnail } = productData

		if(!thumbnail) {
			productData.thumbnail = "./thumbnail1.webp"
		}

		productData.category = productData.category.toLowerCase()

		try {
			await ProductDao.add(productData)
		}
		catch (error) {
			if (error.code === 11000) {
				throw CustomError.createError({
					name: 'Error adding new product',
					cause: ErrorCause.productAlreadyExists(productData.code),
					message: `Product already exists. code must be unique`,
					code: ErrorEnums.CONFLICT_ERROR
				})
			}

			throw CustomError.createError({
				name: 'Error adding new product',
				cause: ErrorCause.creatingProduct(productData),
				message: `Product data is not valid`,
				code: ErrorEnums.INVALID_PARAMS_ERROR
			})
		}
    }
}

export default ProductService