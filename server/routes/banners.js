const { Router } = require('express')
const prisma = require('../lib/prisma')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      where: { is_active: true },
      orderBy: { id: 'asc' },
    })
    res.json(banners)
  } catch (e) {
    next(e)
  }
})

module.exports = router
