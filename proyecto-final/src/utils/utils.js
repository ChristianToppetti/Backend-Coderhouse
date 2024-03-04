import path from 'path'
import bcrypt from 'bcrypt'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import config from '../config/config.js'
import { faker } from '@faker-js/faker'
import multer from 'multer'
  
const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.join(path.dirname(__filename), '..')

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

export const authPolicies = (roles) => (req, res, next) => {
    const jwtEnabled = config.auth.authType === 'JWT'

    const role = jwtEnabled ? req.user && req.user.role : req.session.user && req.session.user.role

    if (!role || !roles.includes(role)) {
        return res.status(401).send('Unauthorized')
    }
    
    return next()
}

export const generateJwtToken = (user) => {
    return jwt.sign(user, config.auth.jwtSecret, { expiresIn: '30m' })
}

export const authJwtToken = (req, res, next) => {
    if (config.auth.authType !== 'JWT') {
        return next()
    }

    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (user) {
            req.logger.info(`JWT Auth successful`)
            req.user = user
        }
        next()
    })(req, res, next)
}

export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const isValidPassword = (password, dbPassword) => bcrypt.compareSync(password, dbPassword)

export const coderAdmin = { 
    first_name: 'Tutor', 
    last_name: 'Coder', 
    email: config.admin.user, 
    age: 9999, 
    password: config.admin.password, 
    role: "admin"
}

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        code: faker.string.alphanumeric({ length: 10 }),
        price: faker.commerce.price(),
        description: faker.lorem.paragraph(),
        status: true,
        stock: faker.number.int({ min: 1, max: 15 }),
        thumbnail: faker.image.url(),
        category: faker.commerce.department()
    }
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let folderPath = '../public/default'
        if(file.fieldname === 'identity_doc' || file.fieldname === 'proof_address' || file.fieldname === 'proof_bankstate') {
            if(config.env === 'developement') {
                folderPath = path.join(__dirname, '../public/documents')
            }
            else {
                // Fix para railway
                folderPath = path.join(__dirname, '../public/')
            }
        } else if(file.fieldname === 'product_image') {
            folderPath = path.join(__dirname, '../public/products')
        } else if(file.fieldname === 'profile_image') {
            folderPath = path.join(__dirname, '../public/profile')
        }
        callback(null, folderPath)
    },
    filename: (req, file, callback) => {
        callback(null, `${file.fieldname}_${file.originalname}`)
    },
})
  
export const uploader = multer({ storage })
  