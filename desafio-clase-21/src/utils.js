import path from 'path'
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

export class Exception extends Error {
    constructor(message, status) {
        super(message)
        this.statusCode = status
    }
}

export const bsonToObject = (bson) => {
    return bson.map(m => { return {...m._doc} }) 
}

export const getLinkToPage = (req, page) => {
    let currentLink = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    if(req.query.page) {
        return currentLink.replace(`page=${req.query.page}`, `page=${page}`)
    }
    
    if(Object.keys(req.query).length !== 0) {
        return currentLink + `&page=${page}`
    }
    
    return currentLink + `?page=${page}`
}

export const auth = (req, res, next) => {
    if (req.session.user) {
        return next()
    }

    return res.redirect('/login')
}

export const authAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.admin) {
        return next()
    }

    return res.status(401).send('Unauthorized')
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, dbPassword) => bcrypt.compareSync(password, dbPassword)

export const coderAdmin = { 
    first_name: 'Tutor', 
    last_name: 'Coder', 
    email: 'adminCoder@coder.com', 
    age: 9999, 
    password: 'adminCode3r123', 
    admin: true 
}