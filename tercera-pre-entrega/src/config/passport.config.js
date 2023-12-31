import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JWTStrategy, ExtractJwt  } from 'passport-jwt'
import { createHash, isValidPassword } from '../utils.js'
import { coderAdmin } from '../utils.js'
import UserController from '../controllers/user.controller.js'
import config from '../config.js'

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
  clientSecret: config.auth.githubSecret,
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
            let user = await UserController.getUser(profile._json.id)

            if (!user) {
                user = await UserController.addUser({
                    first_name: profile._json.login,
                    last_name: '',
                    email: profile._json.id,
                    password: '',
                    role: "user"
                })
            }
            done(null, user)
        }
        catch (error) {
            console.log(error);
            return done(`Something went wrong. ${error}`, false)
        }
    }))

    passport.use('register', new LocalStrategy(localOpts, async (req, email, password, done) => {
        let { first_name, last_name, age, admin } = req.body
        const role = admin == 'on' ? "admin" : "user"

        try {
            if(email == coderAdmin.email) {
                throw {code: 11000}
            }

            const newUser = await UserController.addUser({
                first_name, 
                last_name, 
                email, 
                age,
                password: createHash(password), 
                role 
            })

            done(null, newUser)
        } 
        catch (error) {
            console.log("error", error);
            if (error.code == 11000) {
                return done("Email already taken.", false)
            }

            return done(`Something went wrong. ${error}`, false)
        }
    }))

    passport.use('login', new LocalStrategy(localOpts, async (req, email, password, done) => {
        let user = null
        if(email == coderAdmin.email && password == coderAdmin.password) {
            user = coderAdmin
        }
        else {
            const dbUser = await UserController.getUser(email)
            if ( dbUser && isValidPassword(password, dbUser.password)) {
                user = await dbUser
            }
        }
        
        if(!user) {
            return done('Invalid email or password.', false)
        }
        
        done(null, user)
    }))

    passport.use('jwt', new JWTStrategy(JWTOpts, (payload, done) => {
        return done(null, payload);
    }))

    passport.serializeUser((user, done) => {
        if(user.email === coderAdmin.email) {
            return done(null, coderAdmin.password)
        }
        done(null, user._id)
    })

    passport.deserializeUser(async (uid, done) => {
        try {
            if(uid == coderAdmin.password) {
                return done(null, coderAdmin)
            }

            const user = await UserController.getUserById(uid)
            done(null, user)
        }
        catch (error) {
            done("User not found when deserializing", null)
        }
    })
}