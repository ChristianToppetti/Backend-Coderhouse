import { Router } from 'express'

const router = Router()

router.get('/', async (req, res) => {
    console.log("Mocking Products");
    // res.render('mockingProducts')
})

export default router