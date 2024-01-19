import ChatService from "../services/chat.services.js"

class ChatController {
    static async addMessage(user, message) {
        return await ChatService.addMessage(user, message)
    }
    static async getMessages() {
		return await ChatService.getMessages()
	}
}

export default ChatController