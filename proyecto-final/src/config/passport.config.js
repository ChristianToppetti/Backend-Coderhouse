import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JWTStrategy, ExtractJwt  } from 'passport-jwt'
import { createHash, isValidPassword, coderAdmin} from '../utils/utils.js'
import { CustomError, ErrorCause, ErrorEnums } from '../utils/CustomError.js'

import UserController from '../controllers/user.controller.js'
import config from './config.js'

const localOpts = {
  usernameField: 'email',
  passReqToCallback: true,
}

const JWTOpts = {
    jwtFromRequest: ExtractJwt.fromExtractors([coookieExtractor]),
    secretOrKey: process.env.JWT_SECRET,
}

const githubOpts = {
  clientID: config.auth.githubClientID,
  clientSecret: config.auth.githubSecret,
  callbackURL: config.url.githubCallback,
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
                    email: profile._json.email || profile._json.id,
                    password: '',
                    role: "user"
                })
            }
            done(null, user)
        }
        catch (error) {
            const customError = CustomError.createError({
                name: 'Error authenticating with Github',
                cause: ErrorCause.githubAuthError(error),
                message: `Something went wrong.`,
                code: ErrorEnums.UNKNOWN_ERROR
            })
            return done(customError, false)
        }
    }))

    passport.use('register', new LocalStrategy(localOpts, async (req, email, password, done) => {
        let { first_name, last_name, age, admin } = req.body
        const role = admin == 'on' ? "premium" : "user"

        try {
            if(email == coderAdmin.email) {
                throw {code: 11000}
            } else if(!first_name || !last_name || !age || !email || !password) {
                throw CustomError.createError({
                    name: 'Error creating user',
                    cause: ErrorCause.creatingUser(req.body),
                    message: `One or more fields are invalid.`,
                    code: ErrorEnums.INVALID_PARAMS_ERROR
                })
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
            if (error.code == 11000) {
                const error = CustomError.createError({
                    name: 'Error creating user',
                    cause: ErrorCause.emailTaken(email),
                    message: `One or more fields are invalid.`,
                    code: ErrorEnums.INVALID_PARAMS_ERROR
                })

                return done(error, false)
            }
            return done(error, false)
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
            const error = CustomError.createError({
                name: 'Error login user',
                cause: ErrorCause.invalidCredentials(),
                message: `One or more fields are invalid.`,
                code: ErrorEnums.UNAUTHORIZED_ERROR
            })
            return done(error, false)
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
            req.logger.info("Deserializing user:" + uid);
            const user = await UserController.getUserById(uid)
            done(null, user)
        }
        catch (error) {
            const customError = CustomError.createError({
                name: 'Error deserializing user',
                cause: ErrorCause.userNotFound(uid),
                message: `User not found when deserializing.`,
                code: ErrorEnums.DATA_BASE_ERROR
            })

            done(customError, null)
        }
    })
}