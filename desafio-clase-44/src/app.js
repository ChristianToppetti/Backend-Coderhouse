import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { __dirname, authPolicies, authJwtToken } from './utils/utils.js'
import expressSession from 'express-session'
import MongoStore from 'connect-mongo'
import { URI } from './db/mongodb.js'
import passport from 'passport'
import { init as initPassportConfig } from './config/passport.config.js'
import cookieParser from 'cookie-parser'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'
import accountApiRouter from './routers/api/account.router.js'
import loggerTestRouter from './routers/api/logtest.router.js'

import productsRouter from './routers/views/products.router.js'
import cartsRouter from './routers/views/carts.router.js'
import rtpRouter from './routers/views/rtp.router.js'
import chatRouter from './routers/views/chat.router.js'
import accountRouter from './routers/views/account.router.js'
import mockingProductsRouter from './routers/views/mock.router.js'

import errorHandler from './middlewares/ErrorHandler.js'
import { addLogger } from './config/logger.js'


const app = express()

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion',
            description: 'Documentacion del projecto Backend de Coderhouse'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

const AUTH_TYPE = process.env.AUTH_TYPE
const SESSION_SECRET = process.env.SESSION_SECRET
const COOKIE_SECRET = process.env.COOKIE_SECRET

if (AUTH_TYPE === 'JWT') {
    app.use(cookieParser(COOKIE_SECRET))
} 
else {
    app.use(expressSession({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: URI,
            mongoOptions: {},
            ttl: 120,
        }), 
    }))
}

app.use(addLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'handlebars')

initPassportConfig()
app.use(passport.initialize())
if (AUTH_TYPE === 'SESSION') {
    app.use(passport.session())
} 

app.use('/api/account', accountApiRouter)
app.use('/api/products', productsApiRouter)
app.use('/api/carts', cartsApiRouter)
app.use('/loggerTest', loggerTestRouter)

app.use('/', accountRouter)
app.use('/products', authJwtToken, authPolicies(['admin', 'premium', 'user']), productsRouter)
app.use('/carts', authJwtToken, authPolicies(['admin', 'premium', 'user']), cartsRouter)
app.use('/realtimeproducts', authJwtToken, authPolicies(['premium', 'admin']), rtpRouter)
app.use('/chat', authJwtToken, authPolicies(['user', 'premium']), chatRouter)
app.use('/mockingproducts', authJwtToken, authPolicies(['admin', 'premium', 'user']), mockingProductsRouter)


app.use(errorHandler)

export default app