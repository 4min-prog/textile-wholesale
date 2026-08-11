const { Router } = require('express')
const prisma = require('../lib/prisma')

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { id: 'asc' },
    })
    res.json(categories)
  } catch (e) {
    next(e)
  }
})

module.exports = router
