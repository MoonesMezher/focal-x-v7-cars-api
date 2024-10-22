const express = require('express');
const Car = require('../models/Car');
const { default: mongoose } = require('mongoose');

const router = express.Router();

// GET
router.get('/all', async (req, res) => {
    try {
        // Get all cars in the database
        
        const data = await Car.find({ active: true });

        return res.status(200).json({message: 'Get data successfully', data})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

router.put('/activate/:id', async (req, res) => {
    try {
        // Check valid id 

        const id = req.params.id;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Invalid Id'})
        }

        const car = await Car.findById(id);

        if(!car) {
            return res.status(400).json({message: 'Invalid Car'})
        }

        if(car.active) {
            return res.status(400).json({message: 'This car already active!'})
        }

        car.active = true;

        await car.save();

        return res.status(200).json({ message: "Activated successfully" })

        // await Car.findByIdAndUpdate(id, {active: true})

    } catch (error) {
        return res.status(500).json({message: error.message});        
    }
})

router.put('/disactivate/:id', async (req, res) => {
    try {
        // Check valid id 

        const id = req.params.id;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Invalid Id'})
        }

        const car = await Car.findById(id);

        if(!car) {
            return res.status(400).json({message: 'Invalid Car'})
        }

        if(!car.active) {
            return res.status(400).json({message: 'This car already active!'})
        }

        car.active = false;

        await car.save();

        return res.status(200).json({ message: "Disactivated successfully" })

        // await Car.findByIdAndUpdate(id, {active: true})

    } catch (error) {
        return res.status(500).json({message: error.message});        
    }
})

router.get('/one/:id', async (req, res) => {
    try {
        // Check valid id 

        const id = req.params.id;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Invalid Id'})
        }

        // Check this car is already exist

        const data = await Car.findById(id);

        if(!data) {
            return res.status(400).json({message: 'This car does not exist'})
        }

        return res.status(200).json({message: 'Get data successfully', data})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

// POST
router.post('/add', async (req, res) => {
    try {
        const { title, description, brand, color, price } = req.body;

        // Check this data is required

        if(!title || !description || !brand || !color || !price) {
            return res.status(400).json({message: 'All fields must be required'})
        }

        // Check from types of data as (model)

        if(typeof title !== 'string') {
            return res.status(400).json({message: 'Title must be a string'})
        }

        if(typeof description !== 'string') {
            return res.status(400).json({message: 'Description must be a string'})
        }

        if(typeof brand !== 'string') {
            return res.status(400).json({message: 'Brand must be a string'})
        }

        if(typeof color !== 'string') {
            return res.status(400).json({message: 'Color must be a string'})
        }

        // if(typeof price !== 'number') {
        //     return res.status(400).json({message: 'Price must be a number'})
        // }

        // Check from title is unique as (model)

        const isUnique = await Car.findOne({title});

        if(isUnique) {
            return res.status(400).json({message: 'Title already exists in the database you have to insert unique value'})
        }

        // Check from brand is (AUDI or BMW)

        if(brand !== 'AUDI' && brand !== 'BMW') {
            return res.status(400).json({message: 'Invalid brand'})
        }

        // add new car 

        const data = await Car.create({ title, description, brand, color, price });

        return res.status(200).json({message: 'Added data successfully', data})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

// PUT
router.put('/edit/:id', async (req, res) => {
    try {
        const { title, description, brand, color, price } = req.body;

        // Check valid id

        const id = req.params.id;

        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Invalid Id'})
        }

        // Check this car is already exist

        const car = await Car.findById(id);

        if(!car) {
            return res.status(400).json({message: 'This car does not exist'})
        }

        // if user does not give new value to edit filed i will take the actual value and make my validation

        const data = { title: title || car.title, description: description || car.description, brand: brand || car.brand, color: color || car.color, price: price || car.price }

        // Check this data is required

        if(!data.title || !data.description || !data.brand || !data.color || !data.price) {
            return res.status(400).json({message: 'All fields must be required'})
        }

        // Check from types of data as (model)

        if(typeof data.title !== 'string') {
            return res.status(400).json({message: 'Title must be a string'})
        }

        if(typeof data.description !== 'string') {
            return res.status(400).json({message: 'Description must be a string'})
        }

        if(typeof data.brand !== 'string') {
            return res.status(400).json({message: 'Brand must be a string'})
        }

        if(typeof data.color !== 'string') {
            return res.status(400).json({message: 'Color must be a string'})
        }

        if(typeof data.price !== 'number') {
            return res.status(400).json({message: 'Price must be a number'})
        }

        // Check from title is unique as (model)

        const isUnique = await Car.findOne({title: data.title, _id: { $ne: id }});

        if(isUnique) {
            return res.status(400).json({message: 'Title already exists in the database you have to insert unique value'})
        }

        // Check from brand is (AUDI or BMW)

        if(data.brand !== 'AUDI' && data.brand !== 'BMW') {
            return res.status(400).json({message: 'Invalid brand'})
        }

        // update the car and return the new values

        const dataCar = await Car.findByIdAndUpdate(id, data, { new: true });

        return res.status(200).json({message: 'Updated data successfully', data: dataCar});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

// DELETE
router.delete('/delete/:id', async (req, res) => {
    try {
        // Check valid id

        const id = req.params.id;
        
        if(!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: 'Invalid Id'})
        }

        // Check this car is already exist

        const car = await Car.findById(id);

        if(!car) {
            return res.status(400).json({message: 'This car does not exist'})
        }

        // delete the car from the database

        await Car.findByIdAndDelete(id);

        return res.status(200).json({message: 'Deleted data successfully'})
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
})

module.exports = router;