import { Router } from 'express'
import config from '../../config.js'

const router = Router()

const logedIn = (req) => {
    if (config.auth.authType === 'JWT') {
        return !!req.user
    }
    
    return !!req.session.user
}

router.get('/', (req, res) => {
    if (!logedIn(req)) {
        res.redirect('/login')
        return
    }
    res.redirect('/products')
})

router.get('/login', (req, res) => {
    if (logedIn(req)) {
        res.redirect('/products')
        return
    }

    res.render('login', {title: "Login"})
})

router.get('/register', (req, res) => {
    if (logedIn(req)) {
        res.redirect('/products')
        return
    }

    res.render('register', {title: "Registro"})
})

router.get('/logout', (req, res) => {
    if (!logedIn(req)) {
        res.redirect('/login')
        return
    }

    req.session.destroy((error) => {
        res.redirect('/login')

    })
})

export default router