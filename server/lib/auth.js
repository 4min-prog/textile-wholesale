const jwt = require('jsonwebtoken')

function sign(admin) {
  return jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET)
    req.adminId = payload.id
    next()
  } catch (e) {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = { sign, auth }
