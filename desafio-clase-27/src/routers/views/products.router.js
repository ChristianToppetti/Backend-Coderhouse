import { Router } from 'express'
import ProductManager from '../../dao/ProductManager.js'
import { getLinkToPage } from '../../utils.js'

const router = Router()

router.get('/', async (req, res) => {
  const { limit, page, sort, status, category } = req.query
  const jwtAuthType = process.env.AUTH_TYPE === 'JWT'

  try {
    let result = await ProductManager.getProducts(limit, page, sort, {status, category})

    result = { 
      ...result,
      prevLink: result.hasPrevPage ? getLinkToPage(req, result.prevPage) : null,
      nextLink: result.hasNextPage ? getLinkToPage(req, result.nextPage) : null
    }
    const { first_name, last_name, age, admin } = jwtAuthType? req.user : req.session.user
    res.render('products', {first_name, last_name, age, level: admin?'Admin':'Usuario', ...result })
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params
  
  try {
    const result = await ProductManager.getProductById(pid)

    res.render('details', {
        _id: result._id,
        title: result.title,
        description: result.description,
        code: result.code,
        price: result.price,
        status: result.status,
        stock: result.stock,
        category: result.category
    })
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

export default router