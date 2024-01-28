import ProductService from '../services/product.services.js'

class ProductController {
	static async addProduct(data) {
		await ProductService.addProduct(data)
	}
	
	static async getProducts(limit=10, queryPage=1, querySort=null, queryFilters=null) {
		return await ProductService.getProducts(limit, queryPage, querySort, queryFilters)
	}
	
	static async getProductById(id) {
		return await ProductService.getProductById(id)
	}
	
	static async updateProduct(id, options) {
		return await ProductService.updateProduct(id, options)
	}

	static async deleteProduct(id) {
		await ProductService.deleteProduct(id)
	}
}

export default ProductController