const express = require('express')
const router = express.Router()
const logic = require('../logic')

router.post('/channel', async (req, res) => {
    try {
        const { body: { group_Ids, title, language, picture, has_subchannels} } = req
        await logic.addChannel(group_Ids, title, language, picture, has_subchannels)
        res.json({ message: 'Channel added' })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router
