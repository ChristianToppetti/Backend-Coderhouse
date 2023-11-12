import { Router } from 'express'
import UserModel from '../../dao/models/user.model.js'

const router = Router()
const coderAdmin = { 
    first_name: 'Tutor', 
    last_name: 'Coder', 
    email: 'adminCoder@coder.com', 
    age: 9999, 
    password: 'adminCode3r123', 
    admin: true 
}

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    let user = null

    if(email == coderAdmin.email && password == coderAdmin.password) {
        user = coderAdmin
    }
    else {
        user = await UserModel.findOne({ email, password })
    }

    if(!user) {
        return res.status(401).send('Invalid email or password.')
    }

    const { first_name, last_name, age, admin } = user
    req.session.user = { 
        first_name, 
        last_name, 
        email, 
        age,
        admin
    }

    res.redirect('/products')
})

router.post('/register', async (req, res) => {
    let { first_name, last_name, email, age, password, admin } = req.body
    admin = admin == 'on'

    try {
        if(email == coderAdmin.email) {
            throw {code: 11000}
        }

        await UserModel.create({ first_name, last_name, email, age, password, admin })
    } 
    catch (error) {
        if (error.code == 11000) {
            return res.status(400).send('Email already taken.')
        }
        return res.status(400).send(error)
    }

    res.redirect('/login')
})

export default router