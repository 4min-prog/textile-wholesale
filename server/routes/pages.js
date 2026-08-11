const { Router } = require('express')
const prisma = require('../lib/prisma')

const router = Router()

router.get('/:slug', async (req, res, next) => {
  try {
    const page = await prisma.page.findUnique({ where: { slug: String(req.params.slug) } })
    if (!page) return res.status(404).json({ error: 'Not found' })
    res.json(page)
  } catch (e) {
    next(e)
  }
})

module.exports = router
