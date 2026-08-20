const { Router } = require('express')
const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')
const { sign, auth } = require('../lib/auth')

const router = Router()

const ADMIN_EMAIL = 'admin@alacateksitil.com'
const DEFAULT_PASSWORD = 'admin123'

router.post('/login', async (req, res, next) => {
  try {
    const { password } = req.body
    if (!password) {
      return res.status(400).json({ error: 'Password is required' })
    }

    let admin = await prisma.admin.findFirst()

    if (!admin) {
      const hash = bcrypt.hashSync(DEFAULT_PASSWORD, 10)
      admin = await prisma.admin.create({ data: { email: ADMIN_EMAIL, password: hash } })
    } else if (admin.email === 'admin@site.com') {
      const hash = bcrypt.hashSync(DEFAULT_PASSWORD, 10)
      admin = await prisma.admin.update({ where: { id: admin.id }, data: { email: ADMIN_EMAIL, password: hash } })
    }

    if (!bcrypt.compareSync(password, admin.password)) {
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

module.exports = router
