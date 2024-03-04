import Stripe from 'stripe'
import config from '../config/config.js'

export default class PaymentsService {
	constructor() {
		this.stripe =  new Stripe(config.auth.stripeSecret)
	}

	createPaymentIntent(data) {
		return this.stripe.paymentIntents.create(data)
	}

	createCheckout(data) {
		return this.stripe.checkout.sessions.create(data)
	}
}