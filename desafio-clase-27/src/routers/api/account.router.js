import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.post('/login', passport.authenticate('login', { failureRedirect: './faillogin' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

router.post('/register', passport.authenticate('register', { failureRedirect: './failregister' }), async (req, res) => {
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
    req.session.user = req.user
    res.redirect('/products')
})

export default router