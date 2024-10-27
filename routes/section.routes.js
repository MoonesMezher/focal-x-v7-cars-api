const express = require('express');
const Section = require('../models/Section');
const Car = require('../models/Car');
const router = express.Router();

// GET
router.get('/all', async (req, res) => {
    try {
        const sections = await Section.find({});

        return res.status(201).json({ message: "Get successfully", data: sections });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

router.get('/filter-by-section/:title', async (req, res) => {
    try {
        const title = req.params.title;

        if(!title) {
            return res.status(400).json({ message: "title not provided"});
        }

        const section = await Section.findOne({ title });

        if(!section) {
            return res.status(400).json({ message: "this section not found"});
        }

        const carsIds = section.carIds;

        const cars = await Promise.all(carsIds.map(async (carId) => {
            const car = await Car.findById(carId);

            return car;
        }))

        return res.status(201).json({ message: "Get successfully", data: cars });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

// POST
router.post('/add', async (req, res) => {
    try {
        const title = req.body.title;

        if(!title) {
            return res.status(400).json({ message: "title not provided"});
        }

        if(typeof title !== 'string') {
            return res.status(400).json({ message: "title must be string"});
        }

        const section = await Section.create({ title })

        return res.status(201).json({ message: "Get successfully", data: section });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

router.put('/add-car/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const carId = req.body.carId;

        if(!id) {
            return res.status(400).json({ message: "id not provided"});
        }

        const section = await Section.findById(id);

        if(!section) {
            return res.status(400).json({ message: "this section is not exist"});
        }

        section.carIds.push(carId);

        await section.save();

        return res.status(201).json({ message: "Add car to section successfully", data: section });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

module.exports = router