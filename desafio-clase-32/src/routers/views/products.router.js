import { Router } from 'express'
import ProductController from '../../controllers/product.controller.js'
import { getLinkToPage } from '../../utils/utils.js'

const router = Router()

router.get('/', async (req, res, next) => {
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
    res.render('products', {
        first_name, 
        last_name, 
        age, 
        level: role == "admin" ? 'Admin' : 'Usuario', 
        cartId, 
        ...result 
      })
  }
  catch (error) {
    next(error)
  }
})

router.get('/:pid', async (req, res, next) => {
  const { pid } = req.params
  
  try {
    const result = await ProductController.getProductById(pid)
    res.render('details', {...result})
  }
  catch (error) {
    next(error)
  }
})

export default router