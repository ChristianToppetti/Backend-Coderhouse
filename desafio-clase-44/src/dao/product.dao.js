import ProductModel from './models/product.model.js'

class ProductDao {
    static async add(productData) {
        await ProductModel.create(productData)
    }

    static async get(query, options) {
		return await ProductModel.paginate(query, {...options})
	}

    static async getById(id) {
        const product = await ProductModel.findOne({_id: id})
        return { ...product._doc }
    }

    static async getByCode(code) {
        const product = await ProductModel.findOne({code: code})
        return { ...product._doc }
    }

    static async update(id, options) {
		return await ProductModel.updateOne({_id: id}, { ...options })
	}
    
	static async delete(id) {
		await ProductModel.deleteOne({_id: id})
	}
}

export default ProductDao