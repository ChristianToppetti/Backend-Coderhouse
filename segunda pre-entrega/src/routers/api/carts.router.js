import { Router } from 'express'
import CartManager from '../../dao/CartManager.js'
import ProductManager from '../../dao/ProductManager.js'

const router = Router()

router.post('/', async (req, res) => {
  let result = await CartManager.addCart({})
  res.status(201).json(result)
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params
  try {
    const cart = await CartManager.getCartById(cid)
    const cartProducts = []
  
    for (const e of cart.products) {
      try {
        const product = await ProductManager.getProductById(e.id)
        cartProducts.push({product, quantity: e.quantity})
      }
      catch {
        continue
      }
    }

    res.status(201).json(cartProducts)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
    return
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params
  try {
    const cart = await CartManager.getCartById(cid)
    
    const foundProduct = await ProductManager.productExists(pid)

    if(foundProduct)
    {
      const productIndex = cart.products.findIndex(e => e.id == pid)

      if(productIndex != -1) {
        cart.products[productIndex].quantity++
      }
      else {
        cart.products.push({
          id: pid,
          quantity: 1
        })
      }

      try {
        let result = await CartManager.updateCart(cid, cart.products)
        res.status(201).json(result)
      }
      catch (error) {
        res.status(error.statusCode || 500).send(error.message)
      }
      return
    }

    res.status(404).send(`Product with id "${pid}" not found`)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params
  
  const product = await ProductManager.getProductById(pid)
  res.json(product)

})

export default router