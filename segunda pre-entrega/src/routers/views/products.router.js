import { Router } from 'express'
import ProductManager from '../../dao/ProductManager.js'
import { getLinkToPage } from '../../utils.js'

const router = Router()
const update = async (products) => {
  const cat = ["pantalones", "calzados", "remeras"]
  let i = -1
  products.forEach(async (e) => {
    if(!e.category) {
      if(i >= 2) {i = -1}

      i++
      await ProductManager.updateProduct(e._id, {category: cat[i]})
    }
  });
}
router.get('/', async (req, res) => {
  const { limit, page, sort, status, category } = req.query
  
  try {
    let result = await ProductManager.getProducts(limit, page, sort, {status, category})

    result = { 
      ...result,
      prevLink: result.hasPrevPage ? getLinkToPage(req, result.prevPage) : null,
      nextLink: result.hasNextPage ? getLinkToPage(req, result.nextPage): null
    }

    // update(result.payload)
    res.render('products', { ...result })
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error.message)
  }
})

export default router