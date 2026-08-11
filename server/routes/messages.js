const { Router } = require('express')
const prisma = require('../lib/prisma')

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' })
    }
    const created = await prisma.message.create({
      data: { name, email, phone: String(phone || ''), message },
    })
    res.status(201).json(created)
  } catch (e) {
    next(e)
  }
})

module.exports = router
