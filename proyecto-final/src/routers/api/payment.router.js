import { Router } from 'express'
import PaymentsService from '../../services/payment.services.js'
import UserController from '../../controllers/user.controller.js'
import TicketController from '../../controllers/ticket.cotroller.js'
import { TicketDto } from '../../dao/dto/ticket.dto.js'
import { getLogger } from '../../config/logger.js'

const router = Router()

router.get('/:cid/payment-intents', async (req, res, next) => {
	const { cid } = req.params
	try {
		const user = await UserController.getUserByCart(cid)
		const newTicket = await TicketController.addTicket(new TicketDto(user))

		const sessionData = {
			line_items: newTicket.products.map((product) => {
				return {
					price_data: {
						currency: 'usd',
						product_data: {
							name: product.title,
							metadata: {pid: `${product.pid._id}`},
						},

						unit_amount: parseFloat(product.price) * 100,
					},
					quantity: product.quantity,
				}
			}),
			mode: 'payment',
			ui_mode: 'embedded',
			redirect_on_completion: 'never',
			billing_address_collection: 'required',
		}
		
		const service = new PaymentsService()
		const session = await service.createCheckout(sessionData)

		res.status(201).json({ 
			clientSecret: session.client_secret, 
			ticketCode: newTicket.code 
		})
	}
	catch (error) {
		next(error)
	}
})
  
router.get('/success', async (req, res, next) => {
	try {
		const { id } = req.query
		const ticket = await TicketController.setAsComplete(id)
		ticket.purchaser = undefined
		
		res.status(201).json({ ticket })
	}
	catch (error) {
		next(error)
	}
})

export default router