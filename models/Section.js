const { default: mongoose, Schema } = require("mongoose");

// const CarSchema = new mongoose.Schema({
//     type: Schema.Types.ObjectId,
//     // ref: "Car"
// })

const Section = mongoose.model('Section', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    carIds: {
        type: [Schema.Types.ObjectId],
    }
}, {
    timestamps: true
}));

module.exports = Section;