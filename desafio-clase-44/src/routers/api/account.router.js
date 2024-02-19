import { Router } from 'express'
import passport from 'passport'
import config from '../../config/config.js'
import { generateJwtToken, authJwtToken } from '../../utils/utils.js'
import { FrontUser } from '../../dao/dto/user.dto.js'
import CartService from '../../services/cart.services.js'
import UserService from '../../services/user.services.js'
import EmailService from '../../services/email.services.js'
import { createHash, isValidPassword, uploader } from '../../utils/utils.js'
import UserController from '../../controllers/user.controller.js'

const router = Router()
const boolSession = config.auth.authType === 'SESSION'

router.post('/login', passport.authenticate('login', { session: boolSession, failureRedirect: './faillogin'}), async (req, res) => {
    if (config.auth.authType === 'JWT') {
        const payload = {
            _id: req.user._id,
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
        else {
            await UserController.updateConnectionDate(req.user._id)
        }

        res.status(201).cookie("access_token", generateJwtToken(payload), { signed: true, httpOnly: true, maxAge: 1000 * 60 * 10 })
        .redirect('/products')
    }
    else {
        req.session.user = req.user

        if (req.user.email == config.admin.user) {
            req.session.user.cart = await CartService.getAdminCart()
        }
        else {
            await UserController.updateConnectionDate(req.session.user._id)
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
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: req.user.role,
            cart: req.user.cart
        }

        res.cookie("access_token", generateJwtToken(payload), { httpOnly: true, signed: true, maxAge: 600000 })
    } else {
        req.session.user = req.user
    }
    
    await UserController.updateConnectionDate(req.user._id)
    res.status(201).redirect('/products')
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

router.get('/premium/:uid', async (req, res, next) => {
    const { uid } = req.params
    try {
        const user = await UserController.getUserById(uid)
        const newRole = user.role === 'user' ? 'premium' : 'user'

        if(newRole === "premium") {
            console.log("ok");
            let docs = {}
            user.documents.forEach(doc => {
                docs[doc.name] = true
            })

            const { identity_doc, proof_address, proof_bankstate } = docs
            console.log("what", identity_doc, proof_address, proof_bankstate);
            if( !identity_doc || !proof_address || !proof_bankstate) {
                res.status(400).send('You need to upload verification documents to become premium.')
                return
            }
        }

        await UserController.updateRole(uid, newRole)
        res.status(201).send(`Updated role from ${user.role} to ${newRole} successfully, please reload your session to see the changes.`)
    } catch (error) {
        next(error)
    }
})

router.post('/:uid/documents', uploader.fields(
    [
        { name: 'identity_doc', maxCount: 1 },
        { name: 'proof_address', maxCount: 1 },
        { name: 'proof_bankstate', maxCount: 1 }
    ]), async (req, res, next) => {
    const { uid } = req.params
    const { identity_doc, proof_address, proof_bankstate } = req.files

    try {
        if (!identity_doc || !proof_address || !proof_bankstate) {
            res.status(400).send('All three documents are required.')
            return
        }

        await UserController.addDocument(uid, "identity_doc", identity_doc[0].path)
        await UserController.addDocument(uid, "proof_address", proof_address[0].path)
        await UserController.addDocument(uid, "proof_bankstate", proof_bankstate[0].path)

        res.status(201).send(`Updated documents successfully.`)
    } catch (error) {
        next(error)
    }
})

router.get('/', async (req, res, next) => {
    try {
        res.status(201).json(await UserController.getAllUsers())
    }
    catch (error) {
        next(error)
    }
})

export default router