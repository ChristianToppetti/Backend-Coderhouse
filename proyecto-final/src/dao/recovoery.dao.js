import RecoveryModel from "./models/recovery.model.js"

class RecoveryDao {
    static async create(uid) {
        return RecoveryModel.create({uid})
    }
    
    static async getByUid(id) {
        return await RecoveryModel.findOne({uid: id})
    }

    static async getByRid(id) {
        return await RecoveryModel.findOne({_id: id})
    }

    static async delete(id) {
        await RecoveryModel.deleteOne({_id: id})
    }
}

export default RecoveryDao