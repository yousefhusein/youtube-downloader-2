require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(
  cors({
    origin: process.env.PRODUCTION_URL || '*',
    exposedHeaders: ['x-video-title', 'x-video-id'],
  }),
)
app.use('/youtube-download', require('./routes/youtube'))

app.listen(3000, () => {
  console.log('App is successfully started')
})
