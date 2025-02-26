require('dotenv').config()

const express = require('express')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const updateCookies = require('./updateCookies')
const app = express()

updateCookies()
setInterval(updateCookies, 1000 * 60 * 5)

app.use(
  cors({
    origin: '*',
    exposedHeaders: ['x-video-title'],
  }),
)

app.use('/api/download/youtube', require('./routes/youtube'))

app.listen(80, () => {
  console.log('App is successfully started')
})
