import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import { ProductManager, Product } from './modules/productManager.js'

const server = http.createServer(app)
const socketServer = new Server(server)
const PORT = 8080
const productManager = new ProductManager()

socketServer.on('connection', async (socket) => {
    socketServer.emit('update-products', await productManager.getProducts())

    socket.on('new-product', async ({name, price, stock, description, code}) => {
        const newProduct = new Product(name, description, code, price, true, stock)
        await productManager.addProduct(newProduct)
    
        socketServer.emit('update-products', await productManager.getProducts())
    })
    
    socket.on('delete-product', async (index) => {
        await productManager.deleteProduct(index)
        socketServer.emit('update-products', await productManager.getProducts())
    })
})

server.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}/`);
});