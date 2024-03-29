import dotenv from "dotenv"
import { Command } from "commander"

const program = new Command()

program.option('--mode <mode>', 'env mode', 'dev').parse()

let envFile = null
if (program.opts().mode === 'dev') {
    envFile = "./.env.dev"
    dotenv.config({ path: envFile })
    console.log(envFile, process.env.ENV)
}

export default {
    port: process.env.PORT || 8080,
    env: process.env.ENV || 'developement',
    db: {
        mongoDbUri: process.env.MONGODB_URI
    },
    auth: {
        authType: process.env.AUTH_TYPE,
        jwtSecret: process.env.JWT_SECRET,
        sessionSecret: process.env.SESSION_SECRET,
        githubSecret: process.env.GITHUB_SECRET,
        githubClientID: process.env.GITHUB_CLIENTID,
        stripePublic: process.env.STRIPE_PUBLICKEY,
        stripeSecret: process.env.STRIPE_SECRET
    },
    url: {
        githubCallback: process.env.GITHUB_CALLBACK
    },
    admin: {
        user: process.env.ADMIN_USER,
        password: process.env.ADMIN_PASS
    },
    mail: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS,
        port: process.env.MAIL_PORT,
    }
}