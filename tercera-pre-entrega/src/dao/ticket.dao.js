import TicketModel from './models/ticket.model'

class TicketDao {
    static async add(ticket) {
        return await TicketModel.create(ticket)
    }

	static async get(criteria = {}) {
		return await TicketModel.find(criteria)
	}

	static async getById(id) {
		return await TicketModel.findOne({_id: id})
	}

    static async update(id, products) {
		return await TicketModel.updateOne({_id: id}, {products})
	}
	static async delete(id) {
		await TicketModel.deleteOne({_id: id})
	}
}

export default TicketDao