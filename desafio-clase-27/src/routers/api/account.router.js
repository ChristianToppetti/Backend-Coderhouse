import { Router } from 'express'
import passport from 'passport'
import { generateJwtToken, authJwtToken } from '../../utils.js'
import CartService from '../../services/cart.services.js'
import config from '../../config.js'

const router = Router()

router.post('/login', passport.authenticate('login', { session: false, failureRedirect: './faillogin' }), async (req, res) => {
    if (process.env.AUTH_TYPE === 'JWT') {
        const payload = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        }

        if (payload.email == config.admin.user) {
            payload.cart = await CartService.getAdminCart()
        }
        
        res.cookie("access_token", generateJwtToken(payload), { signed: true, httpOnly: true, maxAge: 1000 * 60 * 2 })
            .status(201)
            .redirect('/products')
    }
    else {
        req.session.user = req.user
        res.redirect('/products')
    }
})

router.post('/register', passport.authenticate('register', { session: false, failureRedirect: './failregister' }), async (req, res) => {
    res.redirect('/login')
})

router.get('/faillogin', (req, res) => {
    res.send('fail login')
})

router.get('/failregister', (req, res) => {
    res.send('fail register')
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: './faillogin' }), async (req, res) => {
    if (process.env.AUTH_TYPE === 'JWT') {
        const payload = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        }
        res.cookie("access_token", generateJwtToken(payload), { httpOnly: true, signed: true, maxAge: 1000 * 60 * 2 })
            .status(201)
            .redirect('/products')
        return
    } else {
        req.session.user = req.user
    }
    res.redirect('/products')
})

router.get('/current', authJwtToken, (req, res) => {
    if (process.env.AUTH_TYPE === 'JWT') {
        res.status(201).json(req.user)
    } 
    else if (process.env.AUTH_TYPE === 'SESSION') {
        res.status(201).json(req.session.user)
    }
})

export default router