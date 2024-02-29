import { expect } from 'chai'
import supertest from 'supertest'
import config from '../src/config/config.js'
import ProductService from '../src/services/product.services.js'
import UserService from '../src/services/user.services.js'
import { init } from '../src/db/mongodb.js'
import { createHash } from '../src/utils/utils.js'

const requester = supertest(`http://localhost:${config.port}`)

describe('Products, Users and Sessions testing', function(){
  this.timeout(5000)

  before(async () => {
    await init()
    const productCode = `${Date.now()}`
    const userEmail = `test${productCode}@test.com`

    this.testUser = await UserService.addUser({
      "first_name": "Test name", 
      "last_name": "Test lastname", 
      "email": userEmail, 
      "age": 99,
      "password": createHash("testpassword")
    })
    this.testCart = await this.testUser.cart

    await ProductService.addProduct({
      "title": "TESTING",
      "code": productCode,
      "price": 100.2,
      "description": "Product description",
      "status": true,
      "stock": 10,
      "thumbnail": "./images/product-1.png",
      "category": "remeras",
      "owner": "testing@test.com"
    })
    this.testProduct = await ProductService.getProductByCode(productCode)
  })

  describe('Test of users', () => {
    it('Creates a new user', async () => {
      const { statusCode, ok, _body } = await requester.post('/api/account/register').send({
        first_name: "Creating", 
        last_name: "new user", 
        email: `${Date.now()}@test.com`, 
        age: 99,
        password: "password"
      })
      
      expect(statusCode).to.be.equals(302)
    })

    it('Login a user', async () => {
      const { statusCode, headers } = await requester.post('/api/account/login').send({
        email: this.testUser.email, 
        password: "testpassword"
      })

      expect(statusCode).to.be.equals(302)
      expect(headers).to.be.has.property('location')
      expect(headers.location).to.be.equal('/products')
    })
  })

  describe('Test of carts', () => {

    it('Creates a new cart', async () => {
      const { statusCode, ok, _body } = await requester.post('/api/carts').send({})

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
      expect(_body).to.be.an('object')
      expect(_body).to.be.has.property('_id')
    })

    it('Get a cart products', async () => {
      const { statusCode, ok, _body } = await requester.get(`/api/carts/${this.testCart._id}`)

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
      expect(_body).to.be.an('array')
    })

    it('Updates a cart', async () => {
      const { statusCode, ok, _body } = await requester.put(`/api/carts/${this.testCart._id}`).send(
        [
          {
            "product": this.testProduct._id,
            "quantity": 333333
          }
        ]
      )

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
      expect(_body).to.be.an('object')
      expect(_body).to.be.has.property('_id')
    })

    it('Deletes all cart products', async () => {
      const { statusCode, ok } = await requester.delete(`/api/carts/${this.testCart._id}`)

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
    })

    it('Add product to cart', async () => {
      const { statusCode, ok } = await requester.post(`/api/carts/${this.testCart._id}/products/${this.testProduct._id}`)
      
      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
    })

    it('Delete product from cart', async () => {
      const { statusCode, ok } = await requester.delete(`/api/carts/${this.testCart._id}/products/${this.testProduct._id}`)
      
      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
    })

    it('Add a product with quantity', async () => {
      const { statusCode, ok } = await requester.put(`/api/carts/${this.testCart._id}/products/${this.testProduct._id}`).send({
        "quantity": 99
      })
      
      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
    })
  })

  describe('Test of products', () => {
    it('Gets a list of products', async () => {
      const { statusCode, ok ,_body } = await requester.get('/api/products')

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
      expect(_body).to.be.has.property('payload')
      expect(_body.payload).to.be.an('array')
    })

    it('Gets a product by id', async () => {
      const { statusCode, ok, _body } = await requester.get(`/api/products/${this.testProduct._id}`)

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
      expect(_body).to.be.an('object')
      expect(_body).to.be.has.property('_id')
    })

    it('Creates a new product', async () => {
      const { statusCode, ok } = await requester.post('/api/products').send({
        "title": "CREATE TEST",
        "code": `${Date.now()}`,
        "price": 100.2,
        "description": "Creates a new product",
        "status": true,
        "stock": 10,
        "thumbnail": "./images/product-1.png",
        "category": "remeras",
        "owner": "testing@test.com"
      })

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
    })

    it('Updates a product', async () => {
      const { statusCode, ok, _body } = await requester.put(`/api/products/${this.testProduct._id}`).send({
        "title": "TESTING",
        "price": 999.2,
        "description": "UPDATE TEST",
      })

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
      expect(_body).to.be.an('object')
      expect(_body).to.be.has.property('_id')
    })

    it('Deletes a product', async () => {
      const { statusCode, ok } = await requester.delete(`/api/products/${this.testProduct._id}`)

      expect(statusCode).to.be.equals(201)
      expect(ok).to.be.ok
    })
  })
})