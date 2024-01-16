import TicketModel from './models/ticket.model.js'

class TicketDao {
    static async add(ticket) {
        return await TicketModel.create(ticket)
    }

	static async get(criteria = {}) {
		const result = await TicketModel.findOne(criteria)
		return result?.populate(['purchaser', 'products.pid'])
	}

    static async update(id, products) {
		return await TicketModel.updateOne({_id: id}, {products})
	}
	static async delete(id) {
		await TicketModel.deleteOne({_id: id})
	}
}

export default TicketDao