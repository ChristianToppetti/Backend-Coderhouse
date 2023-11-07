import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { __dirname } from './utils.js'

import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'
import productsRouter from './routers/views/products.router.js'
import cartsRouter from './routers/views/carts.router.js'
import rtpRouter from './routers/views/rtp.router.js'
import chatRouter from './routers/views/chat.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'handlebars')

app.use('/api/products', productsApiRouter)
app.use('/api/carts', cartsApiRouter)

app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use('/realtimeproducts', rtpRouter)
app.use('/chat', chatRouter)

export default app