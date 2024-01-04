import { Router } from 'express'
import { generateProduct } from '../../utils/utils.js'

const router = Router()

router.get('/', async (req, res) => {
    const users = []
    for (let index = 0; index < 50; index++) {
        users.push(generateProduct())
    }

    res.status(200).json(users);
})

export default router