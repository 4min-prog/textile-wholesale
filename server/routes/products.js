const { Router } = require('express')
const prisma = require('../lib/prisma')

const router = Router()

function parseImages(images) {
  if (Array.isArray(images)) return images
  if (typeof images === 'string') {
    try {
      return JSON.parse(images)
    } catch {
      return []
    }
  }
  return []
}

router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query
    const where = { is_active: true }

    if (category) {
      const c = await prisma.category.findUnique({ where: { slug: String(category) } })
      if (!c) return res.json([])
      where.categoryId = c.id
    }

    const q = String(search || '').trim()
    if (q) {
      where.OR = [
        { name_tr: { contains: q, mode: 'insensitive' } },
        { name_en: { contains: q, mode: 'insensitive' } },
        { name_ar: { contains: q, mode: 'insensitive' } },
        { desc_tr: { contains: q, mode: 'insensitive' } },
        { desc_en: { contains: q, mode: 'insensitive' } },
        { desc_ar: { contains: q, mode: 'insensitive' } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { created_at: 'desc' },
    })
    res.json(products.map((p) => ({ ...p, images: parseImages(p.images) })))
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } })
    if (!product || !product.is_active) return res.status(404).json({ error: 'Not found' })
    res.json({ ...product, images: parseImages(product.images) })
  } catch (e) {
    next(e)
  }
})

module.exports = router
