export default {
    port: process.env.PORT,
    env: process.env.ENV,
    db: {
        mongoDbUri: process.env.MONGODB_URI
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        sessionSecret: process.env.SESSION_SECRET
    }
}