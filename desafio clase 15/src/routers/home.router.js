import { Router } from 'express'
import ProductManager from '../dao/ProductManager.js'
import { bsonToObjetc } from '../utils.js'

const router = Router()

router.get('/', async (req, res) => {
  const products = await ProductManager.getProducts()
  if (products.length === 0) {
    res.status(201).send('No hay ningun producto')
    return
  }

  res.render('home', { products: bsonToObjetc(products)})
})

export default router