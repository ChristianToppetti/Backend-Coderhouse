import { Router } from 'express'
import ProductController from '../../controllers/product.controller.js'
import { getLinkToPage } from '../../utils.js'

const router = Router()

router.get('/', async (req, res) => {
  const { limit, page, sort, status, category } = req.query
  const user = process.env.AUTH_TYPE === 'JWT'? req.user : req.session.user

  try {
    let result = await ProductController.getProducts(limit, page, sort, {status, category})

    result = { 
      ...result,
      prevLink: result.hasPrevPage ? getLinkToPage(req, result.prevPage) : null,
      nextLink: result.hasNextPage ? getLinkToPage(req, result.nextPage) : null
    }
    const { first_name, last_name, age, role } = user
    const cartId = user.cart._id
    res.render('products', {first_name, last_name, age, level: role == "admin"?'Admin':'Usuario', cartId, ...result })
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

router.get('/:pid', async (req, res) => {
  const { pid } = req.params
  
  try {
    const result = await ProductController.getProductById(pid)
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