import ChatService from "../services/chat.services.js"

class ChatController {
    async addMessage(user, message) {
        return await ChatService.addMessage(user, message)
    }
    async getMessages() {
		return await ChatService.getMessages()
	}
}

export default ChatController