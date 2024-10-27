const express = require('express');
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

// POST
router.post('/', upload.single("img"), async (req, res) => {
    try {
        const file = req.file;

        if(!file) {
            return res.status(400).json({ message: 'file (img) must be required' });
        }

        const path = file.path.replace(/\\/g, '/')

        return res.status(201).json( { message: 'upload file successfully', data: path } )
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

module.exports = router