import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { __dirname, auth, authAdmin } from './utils.js'
import expressSession from 'express-session'
import MongoStore from 'connect-mongo'
import { URI } from './db/mongodb.js'
import passport from 'passport'
import { init as initPassportConfig } from './config/passport.config.js'

import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'
import productsRouter from './routers/views/products.router.js'
import cartsRouter from './routers/views/carts.router.js'
import rtpRouter from './routers/views/rtp.router.js'
import chatRouter from './routers/views/chat.router.js'
import accountRouter from './routers/views/account.router.js'
import accountApiRouter from './routers/api/account.router.js'

const app = express()

const SESSION_SECRET = 'SUPER_S3CRETO'

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

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'handlebars')

initPassportConfig()
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/account', accountApiRouter)
app.use('/api/products', productsApiRouter)
app.use('/api/carts', cartsApiRouter)

app.use('/', accountRouter)
app.use('/products', auth, productsRouter)
app.use('/carts', auth, cartsRouter)
app.use('/realtimeproducts', authAdmin, rtpRouter)
app.use('/chat', auth, chatRouter)

export default app