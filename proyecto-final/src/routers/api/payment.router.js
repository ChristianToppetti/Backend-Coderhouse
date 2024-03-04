import { Router } from 'express'
import PaymentsService from '../../services/payment.services.js'
import UserController from '../../controllers/user.controller.js'
import TicketController from '../../controllers/ticket.cotroller.js'
import { TicketDto } from '../../dao/dto/ticket.dto.js'

const router = Router()

const address = {
	street: 'Siempre viva',
	postal_code: '1234213',
	external_number: '100',
}

router.get('/:cid/payment-intents', async (req, res, next) => {
	const { cid } = req.params
	try {
		const user = await UserController.getUserByCart(cid)
		const newTicket = new TicketDto(user)

		const sessionData = {
			line_items: newTicket.products.map((product) => {
				return {
					price_data: {
						currency: 'usd',
						product_data: {
							pid: product.pid,
							name: product.title,
						},
						unit_amount: product.price * 100,
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

		await TicketController.addTicket(newTicket)
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