const express = require('express')
const router = express.Router()
const logic = require('../logic')

router.post('/channel/subchanel', async (req, res) => {
    try {
        const { body: { channel_id, title, language, picture} } = req
        await logic.addSubchannels(channel_id, title, language, picture)
        res.json({ message: 'Subchannel added' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router
