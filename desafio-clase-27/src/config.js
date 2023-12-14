import dotenv from "dotenv"
import { Command } from "commander"

const program = new Command()

program.option('--mode <mode>', 'env mode', 'dev').parse()

let envFile = null
if (program.opts().mode === 'prod') {
    envFile = "./.env.prod"
}
else {
    envFile = "./.env.dev"
}

dotenv.config({ path: envFile })
console.log(envFile, process.env.ENV)

export default {
    port: process.env.PORT,
    env: process.env.ENV,
    db: {
        mongoDbUri: process.env.MONGODB_URI
    },
    auth: {
        authType: process.env.AUTH_TYPE,
        jwtSecret: process.env.JWT_SECRET,
        sessionSecret: process.env.SESSION_SECRET
    },
    admin: {
        user: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASS
    }
}