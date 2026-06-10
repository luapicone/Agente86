const express = require('express')
const cors = require('cors')
require('dotenv').config()

const projectRoutes = require('./routes/projectRoutes')
const renderRoutes = require('./routes/renderRoutes')
const marketplaceRoutes = require('./routes/marketplaceRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'HabitatIA backend', timestamp: new Date().toISOString() })
})

app.use('/api/projects', projectRoutes)
app.use('/api/renders', renderRoutes)
app.use('/api/marketplace', marketplaceRoutes)

module.exports = app
