import ProductModel from './models/product.model.js'
import { Exception } from '../utils.js'

class ProductManager {
	static async productExists(id) {
		try {
			return await ProductModel.findOne({_id: id})
		} 
		catch (error) {
			return false
		}
	}
	static async deleteProduct(id) {
		if (await this.productExists(id)) {
			await ProductModel.deleteOne({_id: id})
		} else {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
	}
	static async updateProduct(id, options) {
		if (!await ProductModel.updateOne({_id: id}, { ...options })) {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
		return await this.getProductById(id)
	}
	static async getProducts(limit=null) {
		if (limit) {
			return await ProductModel.find().limit(limit)
		}
		return await ProductModel.find()
	}
	static async getProductById(id) {
		try {
			return await ProductModel.findOne({_id: id})
		}
		catch (error) {
			throw new Exception(`Product with id "${id}" not found`, 404)
		}
	}
	static async addProduct(productData) {
		try {
			await ProductModel.create(productData)
		}
		catch (error) {
			if (error.code === 11000) {
				throw new Exception(`Product with code "${productData.code}" already exists. code must be unique`, 409)
			}
			throw new Exception("Product data is not valid", 400)
		}
    }
}

export default ProductManager