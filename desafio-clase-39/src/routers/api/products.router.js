import { Router } from 'express'
import ProductController from '../../controllers/product.controller.js'
import { getLinkToPage } from '../../utils/utils.js'

const router = Router()

router.get('/', async (req, res, next) => {
  const { limit, page, sort } = req.query
  try {
    let result = await ProductController.getProducts(limit, page, sort)

    result = { 
      ...result,
      prevLink: result.hasPrevPage ? getLinkToPage(req, result.prevPage) : null,
      nextLink: result.hasNextPage ? getLinkToPage(req, result.nextPage) : null
    }

    res.status(result.status).json(result)
  }
  catch (error) {
    next(error)
  }
})

router.get('/:pid', async (req, res, next) => {
  const { pid } = req.params
  
  try {
    const product = await ProductController.getProductById(pid)
    res.status(201).json(product)
  }
  catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    await ProductController.addProduct(req.query)
    res.status(201).json("Product created successfully.")
  }
  catch (error) {
    next(error)
  }
})

router.put('/:pid', async (req, res, next) => {
  const { pid } = req.params
  
  try {
    let result = await ProductController.updateProduct(pid, {...req.body})
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
})

router.delete('/:pid', async (req, res, next) => {
  const { pid } = req.params

  try {
    await ProductController.deleteProduct(pid)
    res.status(201).send(`Product with id "${pid}" deleted successfully.`)
  }
  catch (error) {
    next(error)
  }
})

export default router