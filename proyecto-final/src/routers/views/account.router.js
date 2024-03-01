import { Router } from 'express'
import config from '../../config/config.js'
import { authJwtToken, authPolicies } from '../../utils/utils.js'
import UserController from '../../controllers/user.controller.js'

const router = Router()

const logedIn = (req) => {
    if (config.auth.authType === 'JWT') {
        return req.user || false
    }

    return req.session.user || false
}

router.get('/', authJwtToken, (req, res) => {
    if (!logedIn(req)) {
        res.redirect('/login')
        return
    }
    res.redirect('/products')
})

router.get('/login', authJwtToken, (req, res) => {
    if (logedIn(req)) {
        res.redirect('/products')
        return
    }

    res.render('login', {title: "Login"})
})

router.get('/register', authJwtToken, (req, res) => {
    if (logedIn(req)) {
        res.redirect('/products')
        return
    }

    res.render('register', {title: "Registro"})
})

router.get('/logout', authJwtToken, async (req, res) => {
    if (!logedIn(req)) {
        res.redirect('/login')
        return
    }

    if (config.auth.authType === 'JWT') {
        const userId = await UserController.getUserByCart(req.user.cart._id)
        await UserController.updateConnectionDate(userId)
        res.clearCookie("access_token").redirect('/login')
    }
    else {
        await UserController.updateConnectionDate(req.session.user._id)
        req.session.destroy((error) => {
            res.redirect('/login')
        })
    }
})

router.get('/recovery', (req, res) => {
    res.render('recovery', {title: "Restablecer", rid: null})
})

router.get('/recovery/:rid', (req, res) => {
    const { rid } = req.params

    res.render('recovery', {title: "Restablecer", rid})
})

router.get('/users', authJwtToken, authPolicies(['admin']), async (req, res) => {
    const allUsers = await UserController.getAllUsers(true)
    const users = allUsers.map(e => {
        return { 
            name: e.first_name, 
            email: e.email,
            role: e.role,
            id: e._id
        }
    })

    res.render('users', { title: "User list", users })
})

router.get('/documents', authJwtToken, authPolicies(['user', 'premium', 'admin']), (req, res) => {
    const user = logedIn(req)
    const uid = user._id

    res.render('documents', { title: "Documentos", uid})
})

export default router