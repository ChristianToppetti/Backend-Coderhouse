import { Router } from 'express'
const router = Router()

router.get('/', async (req, res, next) => {
  console.log(req.logger.level);
  req.logger.debug('Debug level log')
  req.logger.http('HTTP level log')
  req.logger.info('Info level log')
  req.logger.warning('Warning level log')
  req.logger.error('Error level log')
  req.logger.fatal('Fatal level log')
  next()
})

export default router