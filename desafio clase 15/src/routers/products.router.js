import { Router } from 'express'
import ProductManager from '../dao/ProductManager.js'

const router = Router()

router.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const products = await ProductManager.getProducts(limit ? parseInt(limit) : null)
    res.status(201).json(products)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error)
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params
  
  try {
    const product = await ProductManager.getProductById(pid)
    res.status(201).json(product)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.post('/', async (req, res) => {
  let { title, description, code, price, status, stock, thumbnail} = req.query
  
  let boolStatus = status == 'true'
  const productData = { title, description, code, price: parseFloat(price), status: boolStatus, stock: parseInt(stock), thumbnail }

  try {
    let result = await ProductManager.addProduct(productData)
    res.status(201).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.put('/:pid', async (req, res) => {
  const { pid } = req.params
  if(req.query.status) {
    req.query.status = req.query.status.toLocaleLowerCase() == 'true'
  } 
    
  try {
    let result = await ProductManager.updateProduct(pid, {...req.query})
    res.status(201).json(result)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params

  try {
    await ProductManager.deleteProduct(pid)
    res.status(201).send(`Product with id "${pid}" deleted successfully.`)
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

export default router