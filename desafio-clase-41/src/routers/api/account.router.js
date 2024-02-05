import { Router } from 'express'
import passport from 'passport'
import config from '../../config/config.js'
import { generateJwtToken, authJwtToken } from '../../utils/utils.js'
import { FrontUser } from '../../dao/dto/user.dto.js'
import CartService from '../../services/cart.services.js'
import UserService from '../../services/user.services.js'
import EmailService from '../../services/email.services.js'
import { createHash, isValidPassword } from '../../utils/utils.js'

const router = Router()
const boolSession = config.auth.authType === 'SESSION'

router.post('/login', passport.authenticate('login', { session: boolSession, failureRedirect: './faillogin'}), async (req, res) => {
    if (config.auth.authType === 'JWT') {
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
        console.log("wat");
        res.status(201).cookie("access_token", generateJwtToken(payload), { signed: true, httpOnly: true, maxAge: 1000 * 60 * 10 })
        .redirect('/products')
        console.log("wat2");
    }
    else {
        req.session.user = req.user

        if (req.user.email == config.admin.user) {
            req.session.user.cart = await CartService.getAdminCart()
        }
        
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

router.get('/githubcallback', passport.authenticate('github', { session: boolSession, failureRedirect: './faillogin' }), async (req, res) => {
    if (process.env.AUTH_TYPE === 'JWT') {
        const payload = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        }
        res.cookie("access_token", generateJwtToken(payload), { httpOnly: true, signed: true, maxAge: 600000 })
            .status(201)
            .redirect('/products')
        return
    } else {
        req.session.user = req.user
    }
    res.redirect('/products')
})

router.get('/current', authJwtToken, (req, res) => {
    if (config.auth.authType === 'JWT') {
        res.status(201).json(new FrontUser(req.user))
    } 
    else if (config.auth.authType === 'SESSION') {
        res.status(201).json(new FrontUser(req.session.user))
    }
})

router.post('/recovery', async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await UserService.getByEmail(email)

        if (user) {
            // const emailService = EmailService.getInstance()
            if(!await EmailService.recoveryExists(user.email)) {
                const result = await EmailService.sendRecoveryEmail(email)
            }
            
            res.status(201).render('recoveryok', {title: "Restablecer"})
        }
    }
    catch (error) {
        next(error)
    }
})

router.post('/recovery/:rid', async (req, res, next) => {
    try {
        const { rid } = req.params
        const { password } = req.body

        const user = await EmailService.getUserByRid(rid)

        if (user) {
            if (!isValidPassword(password, user.password)) {
                const userId = user._id.toString()
                await UserService.updatePassword(userId, createHash(password))
                res.status(201).send(`Password updated successfully.`)
                return
            }

            res.status(201).send(`The new password can't be the same as the old one.`)
            return
        }

        res.status(404).redirect('../../../recovery')
    }
    catch (error) {
        next(error)
    }
})

export default router