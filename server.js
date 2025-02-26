require('dotenv').config()

const express = require('express')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const os = require('node:os')
const app = express()

const cookiesPath = path.join(__dirname, './cookies.json')
let isUpdating = false

setInterval(async () => {
  if (!isUpdating) {
    isUpdating = true
    try {
      let executablePath

      if (os.type().toLowerCase().includes('Windows')) {
        console.log(`Windows detected`)
        executablePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
      } else {
        executablePath = '/usr/bin/google-chrome'
      }

      console.log('Launching puppeteer')
      const browser = await puppeteer.launch({
          browser: 'chrome',
          executablePath,
        }),
        page = await browser.newPage(),
        youtube = await page.goto('https://youtube.com'),
        cookies = await browser.cookies()

      console.log(`Cookies are updated!`)

      fs.writeFileSync(cookiesPath, JSON.stringify(cookies, null, 4))

      await browser.close()
    } catch (error) {
      console.error(error)
      console.error("Couldn't update cookies")
    } finally {
      isUpdating = false
    }
  }
}, 1000 * 5)

app.use(
  cors({
    origin: '*',
    exposedHeaders: ['x-video-title'],
  }),
)
app.use('/api/download/youtube', require('./routes/youtube'))

app.listen(8080, () => {
  console.log('App is successfully started')
})
