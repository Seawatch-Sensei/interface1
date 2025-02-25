const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const foodShareItemSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    location: { type: String, required: true },
    postedBy: { type: String, required: true }, // Google email
    postedByName: { type: String, required: true }, // Google name
    isDonated: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const FoodShareItem = mongoose.models.FoodShareItem || mongoose.model('FoodShareItem', foodShareItemSchema);

module.exports = { FoodShareItem };
