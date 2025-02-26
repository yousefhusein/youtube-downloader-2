const express = require('express')
const router = express.Router()
const { ApifyClient } = require('apify-client')
const { rateLimit } = require('express-rate-limit')
const apifyClient = new ApifyClient({
  token: process.env.APIFY_CLIENT_API_KEY,
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 2,
  legacyHeaders: false,
})

const actor = apifyClient.actor('xtech/youtube-video-downloader')

router.get('/', limiter, async (req, res) => {
  const call = await actor.call({ urls: [req.query.url] })
  const { items } = await apifyClient.dataset(call.defaultDatasetId).listItems()

  if (items.length < 1 || !items[0].download_url) {
    return res.status(400).json({ error: 'This video could not be found' })
  }

  try {
    res.status(200).json(items[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to download the video' })
  }
})

module.exports = router
