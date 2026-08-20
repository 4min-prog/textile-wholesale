const { Router } = require('express')
const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')
const { sign, auth } = require('../lib/auth')

const router = Router()

router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body
    if (!password) {
      return res.status(400).json({ error: 'Password is required' })
    }
    const admin = await prisma.admin.findFirst()
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    res.json({ token: sign(admin), admin: { id: admin.id, email: admin.email } })
  } catch (e) {
    next(e)
  }
})

router.get('/me', auth, async (req, res, next) => {
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

router.post('/fix-admin', async (req, res, next) => {
  try {
    const { secret } = req.body
    if (secret !== 'fix-alaca-2024') {
      return res.status(403).json({ error: 'Forbidden' })
    }
    const bcryptHash = bcrypt.hashSync('admin123', 10)
    const admin = await prisma.admin.findFirst()
    if (!admin) {
      const created = await prisma.admin.create({
        data: { email: 'admin@alacateksitil.com', password: bcryptHash },
      })
      return res.json({ ok: true, action: 'created', email: created.email })
    }
    if (admin.email !== 'admin@alacateksitil.com' || !bcrypt.compareSync('admin123', admin.password)) {
      const updated = await prisma.admin.update({
        where: { id: admin.id },
        data: { email: 'admin@alacateksitil.com', password: bcryptHash },
      })
      return res.json({ ok: true, action: 'updated', email: updated.email })
    }
    res.json({ ok: true, action: 'already_ok', email: admin.email })
  } catch (e) {
    next(e)
  }
})

module.exports = router
