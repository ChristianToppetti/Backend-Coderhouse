import { Router } from 'express'
import { ProductManager } from '../modules/productManager.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res) => {
  const products = await productManager.getProducts()
  if (products.length === 0) {
    res.status(201).send('No hay ningun producto')
    return
  }

  res.render('home', { products })
})

export default router