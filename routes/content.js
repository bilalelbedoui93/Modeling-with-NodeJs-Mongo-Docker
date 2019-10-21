const express = require('express')
const router = express.Router()
const logic = require('../logic')

router.post('/content-video', async (req, res) => {
    try {
        const { body: { channel_id, type, title, author, movie_director, genre, description, file_url } } = req
        await logic.addVideoContent(channel_id, type, title, author, movie_director, genre, description, file_url)
        res.json({ message: 'content_video added' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/content-pdf', async (req, res) => {
    try {
        const { body: { channel_id, type, title, author, description, file_url } } = req
        await logic.addPdfContent(channel_id, type, title, author, description, file_url)
        res.json({ message: 'content_pdf added' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/content-text', async (req, res) => {
    try {
        const { body: { channel_id, type, title, author, text_body } } = req
        await logic.addTextContent(channel_id, type, title, author, text_body)
        res.json({ message: 'content_text added' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/content/rating', async (req, res) => {
    try {
        debugger
        const { body: { rating_value, channel_id, content_id } } = req
        await logic.addRatingValueContentChannel(rating_value, channel_id, content_id)
        res.json({ message: 'rating value added to content' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/subchannel/content-video', async (req, res) => {
    try {
        debugger
        const { body: { channel_id, subchannel_id, type, title, author, movie_director, genre, description, file_url } } = req
        await logic.addSubchannelVideoContent(channel_id, subchannel_id, type, title, author, movie_director, genre, description, file_url)
        res.json({ message: 'content_video added to subchannel' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/subchannel/content-pdf', async (req, res) => {
    try {
        debugger
        const { body: { channel_id, subchannel_id, type, title, author, description, file_url } } = req
        await logic.addSubchannelPdfContent(channel_id, subchannel_id, type, title, author, description, file_url)
        res.json({ message: 'content_pdf added to subchannel' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/subchannel/content-text', async (req, res) => {
    try {
        const { body: { channel_id, subchannel_id, type, title, author, text_body } } = req
        await logic.addSubchannelTextContent(channel_id, subchannel_id, type, title, author, text_body)
        res.json({ message: 'content_text added to subchannel' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/subchannel/content/rating', async (req, res) => {
    try {
        const { body: { rating_value, channel_id, subchannel_id, content_id } } = req
        await logic.addRatingValueContentSubchannel(rating_value, channel_id, subchannel_id, content_id)
        res.json({ message: 'rating value added to subchannel content' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})


module.exports = router

