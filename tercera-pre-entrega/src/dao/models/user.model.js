import { mongoose } from 'mongoose'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'cart' },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
}, { timestamps: true })

export default mongoose.model('user', userSchema)