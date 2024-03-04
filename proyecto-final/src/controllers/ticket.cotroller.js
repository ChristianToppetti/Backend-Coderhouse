import TicketService from "../services/ticket.services.js"

class TicketController {
    static async addTicket(ticket) {
        return await TicketService.addTicket(ticket)
    }

    static async getTicketByUser(user) {
        return await TicketService.getByUser(user)
    }

    static async getTicketByCode(code) {
        return await TicketService.getByCode(code)
    }

    static async setAsComplete(code) {
        await TicketService.updateStatus(code, 'completed')
        await TicketService.completeTicket(code)
        return await TicketService.getByCode(code)
    }
}

export default TicketController