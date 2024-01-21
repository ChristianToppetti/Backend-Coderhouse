import { Router } from 'express'
import UserController from '../../controllers/user.controller.js'
import config from '../../config/config.js'

const router = Router()


router.get('/:uid', async (req, res, next) => {
    const { uid } = req.params
    try {
        const user = await UserController.getUserById(uid)
        const newRole = user.role === 'user' ? 'premium' : 'user'
        await UserController.updateRole(uid, newRole)
        res.status(201).send(`Updated role from ${user.role} to ${newRole} successfully, please reload your session to see the changes.`)
    } catch (error) {
        next(error)
    }
})

export default router