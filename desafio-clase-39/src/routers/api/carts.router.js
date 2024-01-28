import { Router } from 'express'
import CartController from '../../controllers/cart.cotroller.js'
import TicketController from '../../controllers/ticket.cotroller.js'
import UserController from '../../controllers/user.controller.js'
import { TicketDto } from '../../dao/dto/ticket.dto.js'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    let result = await CartController.addCart({})

    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/:cid', async (req, res, next) => {
  const { cid } = req.params
  try {
    const cart = await CartController.getCartById(cid, true)

    res.status(201).json(cart.products)
  }
  catch (error) {
    next(error)
  }
})

router.get('/:cid/purchase', async (req, res, next) => {
  const { cid } = req.params
  try {
    const user = await UserController.getUserByCart(cid)
    const ticket = await TicketController.addTicket(new TicketDto(user))
    ticket.purchaser.password = undefined
    res.status(201).json(ticket)
  }
  catch (error) {
    next(error)
  }
})

router.post('/:cid/products/:pid', async (req, res, next) => {
  const { pid, cid } = req.params

  try {
    const result = await CartController.addProductToCart(cid, pid)
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
})

router.delete('/:cid/products/:pid', async (req, res, next) => {
  const { cid, pid } = req.params
  try {
    await CartController.deleteProductFromCart(cid, pid)
    res.status(201).send(`Product with id "${pid}" in cart with id "${cid}" deleted successfully.`)
  }
  catch (error) {
    next(error)
  }
})

router.put('/:cid', async (req, res, next) => {
  const { cid } = req.params

  if(!Array.isArray(req.body)) {
    res.status(400).send('Body must be an array.')
    return
  }

  try {
    let result = await CartController.updateCart(cid, req.body)
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
})

router.put('/:cid/products/:pid', async (req, res, next) => {
  const { cid, pid } = req.params
  const { quantity } = req.body

  if(isNaN(quantity)) {
    res.status(400).send(`The field "quantity" in the body must be a number, got "${quantity}" instead.`)
    return
  }

  try {
    const result = await CartController.addProductToCart(cid, pid, quantity)
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
})

router.delete('/:cid', async (req, res, next) => {
  const { cid } = req.params
  try {
    let result = await CartController.updateCart(cid, [])
    res.status(201).send(`Successfully deleted all products in cart with id "${cid}".`)
    // res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
})

export default router