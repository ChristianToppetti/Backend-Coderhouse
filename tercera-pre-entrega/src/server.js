import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import ProductController from './controllers/product.controller.js'
import ChatController from './controllers/chat.controller.js'
import { init } from './db/mongodb.js'
import config from './config.js'

await init()

const server = http.createServer(app)
const socketServer = new Server(server)
const PORT = config.port

const getProducts = async () => {
    return (await ProductController.getProducts(0)).payload
}

socketServer.on('connection', async (socket) => {
    // Productos
    socket.on('send-products', async () => {
        socketServer.emit('update-products', await getProducts())
    })

    socket.on('new-product', async ({name, price, stock, description, code, category}) => {
        const testThumbnail = './thumbnail1.webp'
        const newProduct = {
            title:name, 
            description, 
            code, 
            price, 
            status:true, 
            stock, 
            thumbnail:testThumbnail,
            category: category
        }
        try {
            await ProductController.addProduct(newProduct)
        }
        catch (error) {
            socketServer.emit('error-adding', error.message)
            return
        }
    
        socketServer.emit('update-products', await getProducts())
    })
    
    socket.on('delete-product', async (pid) => {
        await ProductController.deleteProduct(pid)
        socketServer.emit('update-products', await getProducts())
    })
    
    // Chat
    socket.on('send-chat', async () => {
        socket.emit('update-chat', await ChatController.getMessages())
    })

    socket.on('new-message', async ({user, message}) => {
        await ChatController.addMessage(user, message)
        socketServer.emit('update-message', {user, message})
    })
})

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}/ (${config.env})`)
})