import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import ProductController from './controllers/product.controller.js'
import ChatController from './controllers/chat.controller.js'
import { init } from './db/mongodb.js'
import config from './config/config.js'
import { getLogger } from './config/logger.js'
import { CustomError, ErrorCause, ErrorEnums } from './utils/CustomError.js'

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

    socket.on('new-product', async ({ product, user }) => {
        const { name, price, stock, description, code, category} = product
        const testThumbnail = './thumbnail1.webp'

        const newProduct = {
            title:name, 
            description, 
            code, 
            price, 
            status:true, 
            stock, 
            thumbnail:testThumbnail,
            category: category,
            owner: user.role == 'admin' ? "admin" : user.email
        }

        try {
            await ProductController.addProduct(newProduct)
        }
        catch (error) {
            getLogger().error(error)
            socketServer.emit('error', error)
            return
        }
    
        socketServer.emit('update-products', await getProducts())
    })
    
    socket.on('delete-product', async ({pid, user}) => {
        try {
            if(user.role != 'admin') {
                const product = await ProductController.getProductById(pid)
                if(product.owner != user.email) {
                    throw CustomError.createError({
                        name: 'Error deleting product',
                        cause: ErrorCause.insufficientPermissions(),
                        message: `You are not the owner of this product`,
                        code: ErrorEnums.UNAUTHORIZED_ERROR
                    })
                }
            }
            await ProductController.deleteProduct(pid)
            socketServer.emit('update-products', await getProducts())
        }
        catch (error) {
            console.log(error);
            getLogger().error(error)
            socketServer.emit('error', error)
        }
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
    getLogger().info(`Server running in http://localhost:${PORT}/ (${config.env})`)
})