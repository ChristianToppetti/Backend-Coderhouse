import { Router } from 'express'
import ChatController from '../../controllers/chat.controller.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const chatMessages = await ChatController.getMessages()
    res.render('chat', { messages: chatMessages})
  }
  catch (error) {
    next(error)
  }
})

export default router