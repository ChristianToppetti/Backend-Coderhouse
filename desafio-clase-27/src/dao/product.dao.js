import ProductModel from './models/product.model.js'

class ProductDao {
    static async add(productData) {
        await ProductModel.create(productData)
    }

    static async get(query, options) {
		const { 
            docs, totalPages, 
            prevPage, nextPage, 
            page, hasPrevPage, 
            hasNextPage 
        } = await ProductModel.paginate(query, {...options})

		return { 
			payload: docs,
			totalPages,
			prevPage,
			nextPage,
			page,
			hasPrevPage,
			hasNextPage
		}
	}

    static async getById(id) {
        const product = await ProductModel.findOne({_id: id})
        return { ...product._doc }
    }

    static async update(id, options) {
		await ProductModel.updateOne({_id: id}, { ...options })
	}
    
	static async delete(id) {
		await ProductModel.deleteOne({_id: id})
	}
}

export default ProductDao