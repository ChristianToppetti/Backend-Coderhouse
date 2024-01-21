import { mongoose } from 'mongoose'

const recoverySchema = new mongoose.Schema({
    uid: { type: String, required: true, unique: true },
    expireAt: {
        type: Date,
        default: new Date(),
        expires: 60 * 60,
    }
}, { timestamps: true})

export default mongoose.model('recovery', recoverySchema)