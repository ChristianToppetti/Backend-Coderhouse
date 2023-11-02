import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import ProductManager from './dao/ProductManager.js'
import ChatManager from './dao/ChatManager.js'
import { init } from './db/mongodb.js'

await init()

const server = http.createServer(app)
const socketServer = new Server(server)
const PORT = 8080

socketServer.on('connection', async (socket) => {
    // Productos
    socket.on('send-products', async () => {
        socketServer.emit('update-products', await ProductManager.getProducts())
    })

    socket.on('new-product', async ({name, price, stock, description, code}) => {
        const testThumbnail = './thumbnail1.webp'
        const newProduct = {title:name, description, code, price, status:true, stock, thumbnail:testThumbnail}
        await ProductManager.addProduct(newProduct)
    
        socketServer.emit('update-products', await ProductManager.getProducts())
    })
    
    socket.on('delete-product', async (index) => {
        await ProductManager.deleteProduct(index)
        socketServer.emit('update-products', await ProductManager.getProducts())
    })

    // Chat
    socket.on('send-chat', async () => {
        socket.emit('update-chat', await ChatManager.getMessages())
    })

    socket.on('new-message', async ({user, message}) => {
        await ChatManager.addMessage({user, message})
        socketServer.emit('update-message', {user, message})
    })
})

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}/`)
})