import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { createHash, isValidPassword } from '../utils.js'
import UserModel from '../dao/models/user.model.js'
import { coderAdmin } from '../utils.js'

const localOpts = {
  usernameField: 'email',
  passReqToCallback: true,
}

const githubOpts = {
  clientID: 'Iv1.2beba5ccbb3912cb',
  clientSecret: '51b521fe591366813f489859c049f6e2dd6d8e13',
  callbackURL: 'http://localhost:8080/api/account/githubcallback',
}

export const init = () => {
    passport.use('github', new GithubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.id })

            if (!user) {
                cartId = fetch("/api/carts/", { method: "POST"})
                        .then(res => res.json())
                        .then(data => data)

                user = await UserModel.create({
                    first_name: profile._json.login,
                    last_name: '',
                    email: profile._json.id,
                    password: '',
                    cart: cartId,
                    admin: false
                })
            }

            done(null, user)
        }
        catch (error) {
            return done(null, false, { message: `Something went wrong. ${error}` })
        }
    }))

    passport.use('register', new LocalStrategy(localOpts, async (req, email, password, done) => {
        let { first_name, last_name, age, admin } = req.body
        admin = admin == 'on'

        try {
            if(email == coderAdmin.email) {
                throw {code: 11000}
            }
            
            cartId = fetch("/api/carts/", { method: "POST"})
                    .then(res => res.json())
                    .then(data => data)

            const newUser = await UserModel.create({
                first_name, 
                last_name, 
                email, age,
                password: createHash(password), 
                cart: cartId,
                admin 
            })

            done(null, newUser)
        } 
        catch (error) {
            if (error.code == 11000) {
                return done(null, false, { message: 'Email already taken.' })
            }

            return done(null, false, { message: `Something went wrong. ${error}` })
        }
    }))

    passport.use('login', new LocalStrategy(localOpts, async (req, email, password, done) => {
        let user = null

        if(email == coderAdmin.email && password == coderAdmin.password) {
            user = coderAdmin
        }
        else {
            const dbUser = await UserModel.findOne({ email })

            if ( dbUser && isValidPassword(password, dbUser.password)) {
                user = dbUser
            }
        }

        if(!user) {
            return done(null, false, { message: 'Invalid email or password.' })
        }

        done(null, user)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (uid, done) => {
        const user = await UserModel.findById(uid)
        done(null, user)
    })
}