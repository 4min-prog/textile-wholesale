require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })

const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const productsRouter = require('./routes/products')
const categoriesRouter = require('./routes/categories')
const bannersRouter = require('./routes/banners')
const pagesRouter = require('./routes/pages')
const messagesRouter = require('./routes/messages')
const authRouter = require('./routes/auth')
const adminRouter = require('./routes/admin')

const uploadDir = path.join(__dirname, 'uploads')
try {
  fs.mkdirSync(uploadDir, { recursive: true })
} catch (e) {
  console.warn('uploads dir unavailable:', e.message)
}

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.use('/uploads', express.static(uploadDir))

app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/banners', bannersRouter)
app.use('/api/pages', pagesRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

module.exports = app
