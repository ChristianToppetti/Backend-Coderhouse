import { bsonToObject } from "../../utils.js"

export default class ProductDto {
    constructor(product) {
        this.status = '201'
        this.payload = bsonToObject(product.docs),
        this.totalPages = product.totalPages,
        this.prevPage = product.prevPage,
        this.nextPage = product.nextPage,
        this.page = product.page,
        this.hasPrevPage = product.hasPrevPage,
        this.hasNextPage = product.hasNextPage
    }
}