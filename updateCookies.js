const fs = require('node:fs')
const path = require('node:path')
const puppeteer = require('puppeteer')
const os = require('node:os')
const cookiesPath = path.join(__dirname, './cookies.json')
let isUpdating = false

module.exports = async function updateCookies() {
  if (!isUpdating) {
    isUpdating = true
    try {
      let executablePath

      if (os.type().toLowerCase().includes('windows')) {
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
}
