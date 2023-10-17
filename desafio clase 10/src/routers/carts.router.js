import { Router } from 'express'
import { CartManager, Cart } from '../modules/cartManager.js'
import { ProductManager } from '../modules/productManager.js'

const router = Router()
const cartManager = new CartManager()
const productManager = new ProductManager()

router.post('/', async (req, res) => {
  let result = await cartManager.addCart(new Cart())
  res.status(201).json(result)
})

router.get('/:cid', async (req, res) => {
  const { cid } = req.params
  const cart = await cartManager.getCartById(cid)
  if (!cart) {
    res.status(404).send('Error, no se encontro el carrito con el id:' + cid)
    return
  }
  
  const cartProducts = []
  for (const e of cart.products) {
    const product = await productManager.getProductById(e.id)
    cartProducts.push(product)
  }

  res.status(201).json(cartProducts)
})

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params

  const cart = await cartManager.getCartById(cid)
  if (!cart) {
    res.status(404).send('Error, no se encontro el carrito')
    return
  }
  if (!await productManager.getProductById(pid)) {
    res.status(404).send('Error, no se encontro el producto con el id:' + pid)
    return
  }
  
  cart.addProduct(parseInt(pid))

  let result = await cartManager.updateCart(cid, cart.products)

  if(!result) {
      res.status(500).send('Error, no se encontro el carrito con el id:' + cid)
      return
  }
  res.status(201).json(result)
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params
  
  const product = await productManager.getProductById(pid)

  if (!product) {
      res.send('Producto no encontrado')
      return
  }
  res.json(product)
})


router.put('/:pid', async (req, res) => {
  const { pid } = req.params
  const { body } = req

  let result = await productManager.updateProduct(pid, {...body})
  if(!result) {
      res.status(404).send('Error, no se encontro el producto con el id:' + pid)
      return
  }
  res.status(201).json(result)
})

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params

  let result = await productManager.deleteProduct(pid)
  if(!result) {
      res.status(404).send('Error, no se encontro el producto con el id:' + pid)
      return
  }
  res.status(201).send('Se elimino el producto con el id:' + pid)
})

export default router