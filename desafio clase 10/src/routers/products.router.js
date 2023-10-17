import { Router } from 'express'
import { ProductManager, Product } from '../modules/productManager.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res) => {
  const { limit } = req.query
  const products = await productManager.getProducts()

  if (!limit) {
      res.json(products)
      return
  }

  slicedProducts = products.slice(0, limit)

  res.json(slicedProducts)
  return
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

router.post('/', async (req, res) => {
  let { title, description, code, price, status, stock, thumbnail} = req.query
  
  if(status === "false") {
    status = false
  }
  else {
    status = true
  }
    
  const newProduct = new Product(title, description, code, parseFloat(price), status, parseInt(stock), thumbnail)

	let result = await productManager.addProduct(newProduct)
  if(!result) {
      res.status(500).send('Error, no se pudo agregar el producto')
      return
  }
  res.status(201).json(result)
})

router.put('/:pid', async (req, res) => {
  const { pid } = req.params
  let result = await productManager.updateProduct(pid, {...req.query})
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