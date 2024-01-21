import MessageModel from './models/message.model.js'

class ChatDao {
	static async getMessages() {
		return await MessageModel.find()
	}
	static async addMessage(data) {
		const result = await MessageModel.create(data)
		return result
    }
}

export default ChatDao