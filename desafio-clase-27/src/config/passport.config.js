import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JWTStrategy, ExtractJwt  } from 'passport-jwt'
import { createHash, isValidPassword } from '../utils.js'
import UserModel from '../dao/models/user.model.js'
import { coderAdmin } from '../utils.js'
import CartManager from '../dao/CartManager.js'

const localOpts = {
  usernameField: 'email',
  passReqToCallback: true,
}

const JWTOpts = {
    jwtFromRequest: ExtractJwt.fromExtractors([coookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
}

const githubOpts = {
  clientID: 'Iv1.2beba5ccbb3912cb',
  clientSecret: '51b521fe591366813f489859c049f6e2dd6d8e13',
  callbackURL: 'http://localhost:8080/api/account/githubcallback',
}

function coookieExtractor(req) {
    let token = null
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token']
    }
    return token
}

export const init = () => {
    passport.use('github', new GithubStrategy(githubOpts, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.id })

            if (!user) {
                const cartId = await CartManager.addCart({})
                user = await UserModel.create({
                    first_name: profile._json.login,
                    last_name: '',
                    email: profile._json.id,
                    password: '',
                    cart: cartId,
                    role: "user"
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
        const role = admin == 'on' ? "admin" : "user"
        console.log("mongo");
        try {
            if(email == coderAdmin.email) {
                throw {code: 11000}
            }
            const cartId = await CartManager.addCart({})

            const newUser = await UserModel.create({
                first_name, 
                last_name, 
                email, age,
                password: createHash(password), 
                cart: cartId,
                role 
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

    passport.use('jwt', new JWTStrategy(JWTOpts, (payload, done) => {
        return done(null, payload);
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (uid, done) => {
        const user = await UserModel.findById(uid)
        done(null, user)
    })
}