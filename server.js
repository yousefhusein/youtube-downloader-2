require('dotenv').config()

const express = require('express')
const cors = require('cors')
const app = express()

app.use(
  cors({
    origin: '*',
    exposedHeaders: ['x-video-title'],
  }),
)
app.use('/api/download/youtube', require('./routes/youtube'))

app.listen(3000, () => {
  console.log('App is successfully started')
})
