import { Router } from 'express'
import CartController from '../../controllers/cart.cotroller.js'

const router = Router()

router.get('/:cid', async (req, res, next) => {
  const { cid } = req.params
  
  try {
    const cart = await CartController.getCartById(cid, true)
    const products = cart.products.map(e => {
      return {...e.product._doc, quantity: e.quantity}
    })

    res.render('cart', { cartId: cid, products })
  }
  catch (error) {
    next(error)
  }
})

export default router