const express = require('express');
const router = express.Router();
const logic = require('../logic');

router.post('/group', async (req, res) => {
    try {
        const { body: { name, description } } = req
        await logic.addGroup(name, description);
        res.json({ message: 'Group added' });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.get('/group/:id', async (req, res) => {
    try {
        debugger
        const { params: { id } } = req
        const {group, channels} = await logic.retrieveGroupWithChannels(id);
        res.json({ group, channels });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router