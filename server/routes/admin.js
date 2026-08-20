const { Router } = require('express')
const path = require('path')
const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')
const { auth } = require('../lib/auth')
const upload = require('../lib/upload')
const { uploadBuffer } = require('../lib/storage')

const router = Router()
router.use(auth)

router.get('/me', async (req, res, next) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.adminId },
      select: { id: true, email: true },
    })
    if (!admin) return res.status(401).json({ error: 'Unauthorized' })
    res.json(admin)
  } catch (e) {
    next(e)
  }
})

// ---------- Change password ----------
router.post('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }
    const admin = await prisma.admin.findUnique({ where: { id: req.adminId } })
    if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    const hash = bcrypt.hashSync(newPassword, 10)
    await prisma.admin.update({ where: { id: admin.id }, data: { password: hash } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

function requireFields(obj, fields) {
  for (const f of fields) {
    if (obj[f] === undefined || obj[f] === null || obj[f] === '') return false
  }
  return true
}

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

// ---------- File upload ----------
router.post('/upload', upload.single('image'), async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  try {
    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg'
    const filePath = `images/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    const url = await uploadBuffer(req.file.buffer, filePath, req.file.mimetype)
    res.json({ url })
  } catch (e) {
    next(e)
  }
})

// ---------- Messages ----------
router.get('/messages', async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { created_at: 'desc' } })
    res.json(messages)
  } catch (e) {
    next(e)
  }
})

router.patch('/messages/:id/read', async (req, res, next) => {
  try {
    const message = await prisma.message.update({
      where: { id: parseInt(req.params.id) },
      data: { is_read: true },
    })
    res.json(message)
  } catch (e) {
    next(e)
  }
})

router.delete('/messages/:id', async (req, res, next) => {
  try {
    await prisma.message.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

// ---------- Products ----------
router.get('/products', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { created_at: 'desc' },
    })
    res.json(products.map((p) => ({ ...p, images: parseImages(p.images) })))
  } catch (e) {
    next(e)
  }
})

function productData(body) {
  const price = parseFloat(body.price)
  let images = body.images
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images)
    } catch {
      images = []
    }
  }
  if (!Array.isArray(images)) images = []
  return {
    name_tr: String(body.name_tr || ''),
    name_en: String(body.name_en || ''),
    name_ar: String(body.name_ar || ''),
    desc_tr: String(body.desc_tr || ''),
    desc_en: String(body.desc_en || ''),
    desc_ar: String(body.desc_ar || ''),
    price: isNaN(price) ? 0 : price,
    min_order: parseInt(body.min_order) || 0,
    images: JSON.stringify(images),
    is_active: body.is_active === true || body.is_active === 'true',
    categoryId: parseInt(body.categoryId),
  }
}

router.post('/products', async (req, res, next) => {
  try {
    if (!requireFields(req.body, ['name_tr', 'name_en', 'name_ar', 'categoryId'])) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const product = await prisma.product.create({
      data: productData(req.body),
      include: { category: true },
    })
    res.status(201).json({ ...product, images: parseImages(product.images) })
  } catch (e) {
    next(e)
  }
})

router.put('/products/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: productData(req.body),
      include: { category: true },
    })
    res.json({ ...product, images: parseImages(product.images) })
  } catch (e) {
    next(e)
  }
})

router.delete('/products/:id', async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

// ---------- Categories ----------
router.get('/categories', async (req, res, next) => {
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

router.post('/categories', async (req, res, next) => {
  try {
    if (!requireFields(req.body, ['name_tr', 'name_en', 'name_ar', 'slug'])) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const category = await prisma.category.create({
      data: {
        name_tr: String(req.body.name_tr),
        name_en: String(req.body.name_en),
        name_ar: String(req.body.name_ar),
        slug: String(req.body.slug),
      },
    })
    res.status(201).json(category)
  } catch (e) {
    next(e)
  }
})

router.put('/categories/:id', async (req, res, next) => {
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name_tr: String(req.body.name_tr),
        name_en: String(req.body.name_en),
        name_ar: String(req.body.name_ar),
        slug: String(req.body.slug),
      },
    })
    res.json(category)
  } catch (e) {
    next(e)
  }
})

router.delete('/categories/:id', async (req, res, next) => {
  try {
    const count = await prisma.product.count({ where: { categoryId: parseInt(req.params.id) } })
    if (count > 0) {
      return res.status(400).json({ error: 'This category still has products — move or delete them first.' })
    }
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

// ---------- Banners ----------
router.get('/banners', async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: { id: 'asc' } })
    res.json(banners)
  } catch (e) {
    next(e)
  }
})

router.post('/banners', async (req, res, next) => {
  try {
    if (!requireFields(req.body, ['image_url', 'title_tr', 'title_en', 'title_ar'])) {
      return res.status(400).json({ error: 'Missing required fields' })
    }
    const banner = await prisma.banner.create({
      data: {
        image_url: String(req.body.image_url),
        title_tr: String(req.body.title_tr),
        title_en: String(req.body.title_en),
        title_ar: String(req.body.title_ar),
        is_active: req.body.is_active === true || req.body.is_active === 'true',
      },
    })
    res.status(201).json(banner)
  } catch (e) {
    next(e)
  }
})

router.put('/banners/:id', async (req, res, next) => {
  try {
    const banner = await prisma.banner.update({
      where: { id: parseInt(req.params.id) },
      data: {
        image_url: String(req.body.image_url),
        title_tr: String(req.body.title_tr),
        title_en: String(req.body.title_en),
        title_ar: String(req.body.title_ar),
        is_active: req.body.is_active === true || req.body.is_active === 'true',
      },
    })
    res.json(banner)
  } catch (e) {
    next(e)
  }
})

router.delete('/banners/:id', async (req, res, next) => {
  try {
    await prisma.banner.delete({ where: { id: parseInt(req.params.id) } })
    res.status(204).end()
  } catch (e) {
    next(e)
  }
})

// ---------- Pages ----------
router.get('/pages', async (req, res, next) => {
  try {
    const pages = await prisma.page.findMany({ orderBy: { id: 'asc' } })
    res.json(pages)
  } catch (e) {
    next(e)
  }
})

router.put('/pages/:id', async (req, res, next) => {
  try {
    const page = await prisma.page.update({
      where: { id: parseInt(req.params.id) },
      data: {
        content_tr: String(req.body.content_tr || ''),
        content_en: String(req.body.content_en || ''),
        content_ar: String(req.body.content_ar || ''),
      },
    })
    res.json(page)
  } catch (e) {
    next(e)
  }
})

module.exports = router
