import { Router } from 'express'
import ChatController from '../../controllers/chat.controller.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const chatMessages = await ChatController.getMessages()
    res.render('chat', { messages: chatMessages})
  }
  catch (error) {
    res.status(error.statusCode || 500).send(error)
  }
})

export default router