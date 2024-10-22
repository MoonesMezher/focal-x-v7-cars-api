const { default: mongoose } = require("mongoose");

const Car = mongoose.model('Car', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    brand: {
        type: String,
        enum: ['AUDI', "BMW"],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'Black'
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
}));

module.exports = Car;