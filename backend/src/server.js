const express = require('express')
const cors = require('cors')
require('dotenv').config()

const projectRoutes = require('./routes/projectRoutes')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'HabitatIA backend', timestamp: new Date().toISOString() })
})

app.use('/api/projects', projectRoutes)

app.listen(PORT, () => {
  console.log(`HabitatIA backend running on port ${PORT}`)
})
