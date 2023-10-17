import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { __dirname } from './utils.js'

import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/carts.router.js'
import homeRouter from './routers/home.router.js'
import rtpRouter from './routers/rtp.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../public')))

app.engine('handlebars', handlebars.engine())
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'handlebars')

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', homeRouter)
app.use('/realtimeproducts', rtpRouter)

export default app