import nodemailer from 'nodemailer'
import config from '../config/config.js'
import RecoveryDao from '../dao/recovoery.dao.js'
import UserService from './user.services.js'
import path from 'path'
import { __dirname } from '../utils/utils.js'

class EmailService {
    static #instance = null
    constructor() {
        this.transport = nodemailer.createTransport({
            service: "gmail",
            port: config.mail.port,
            auth: {
                user: config.mail.user,
                pass: config.mail.password,
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async recoveryExists(uid) {
        try {
			return await RecoveryDao.getByUid(uid)
		} 
		catch (error) {
			return false
		}
    }

    async getUserByRid(rid) {
        try {
            const recovery = await RecoveryDao.getByRid(rid)
            return await UserService.getByEmail(recovery.uid)
        }
        catch {
            return false
        }
    }

    sendEmail(to, subject, html, attachments = []) {
        const atIndex = to.indexOf('@')
        const dotIndex = to.lastIndexOf('.')

        if(atIndex === -1 || dotIndex === -1 || dotIndex < atIndex) {
            // Validacion minima del correo
            return false
        }

        return this.transport.sendMail({
            from: config.mail.user, 
            to, 
            subject, 
            html, 
            attachments,
        })
    }

    async sendRecoveryEmail(email) {
        await RecoveryDao.create(email)
        const recovery = await RecoveryDao.getByUid(email)
        const recoveryId = recovery._id.toString()
        const url = config.env === 'developement' ? `http://localhost:${config.port}` : `https://toppetti-proyectofinal.up.railway.app`
        return this.sendEmail(
            email, 
            `Restablecimiento de contraseña`, 
            `<p>Hemos recibido una solicitud para restablecer tu contraseña, haga click en el siguiente enlace para proceder:</p>
            <a href="${url}/recovery/${recoveryId}">Restablecer contraseña</a>
            <div style="text-align: center;"> <img src="cid:lock" /> </div>`,
            [
                {
                  filename: 'lock.png',
                  path: path.join(__dirname, '../public/images/lock.png'),
                  cid: 'lock',
                }
            ]
        )
    }

    async deleteRecovery(rid) {
        await RecoveryDao.delete(rid)
    }

    static getInstance() {
        if (!EmailService.#instance) {
            EmailService.#instance = new EmailService()
        }
        return EmailService.#instance
    }
}

export default new EmailService()