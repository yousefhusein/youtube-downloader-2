const express = require('express')
const ytdl = require('@distube/ytdl-core')
const router = express.Router()

router.get('/', async (req, res) => {
  const cookies = require('../cookies.json')
  const agent = ytdl.createAgent(cookies, {})
  const videoUrl = req.query.url

  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }

  try {
    const info = await ytdl.getBasicInfo(videoUrl, { agent })
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '')

    res.header(
      'Content-Disposition',
      `attachment; filename="${videoTitle}.mp4"`,
    )
    res.header('Content-Type', 'video/mp4')

    ytdl(videoUrl, {
      format: 'mp4',
      quality: 'highest',
      agent,
    }).pipe(res)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Unable to download the video' })
  }
})

module.exports = router
