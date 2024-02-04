import ChatDao from "../dao/chat.dao.js"
import { bsonToObject } from "../utils/utils.js"

class ChatService {
    static async addMessage(user, message) {
        return await ChatDao.addMessage({user, message})
    }
    static async getMessages() {
        const messages = await ChatDao.getMessages()
        return bsonToObject(messages)
	}
}

export default ChatService