require('dotenv').config();

const express = require('express');

const app = express();

const logger = require('morgan')

app.use(logger('dev'));
app.use(express.json())

const carRouter = require('./routes/car.routes')

app.use('/api/cars', carRouter);
app.use('*', (req, res) => res.status(400).json({message: "Invalid API"}))

// connect with database
const mongoose = require('mongoose');

const MONGOURL = process.env.MONGOURL
const PORT = process.env.PORT

mongoose.connect(MONGOURL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is listening on port http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

