import mongoose from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        //unique: true,
        lowercase: true
    },
    description: {
        type: Array,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    thumb: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        default: 0
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
    },
    rating: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String },
            updatedAt: { type: Date }
        }
    ],
    totalRatings: {
        type: Number,
        default: 0
    },
    variants: [
        {
            title: { type: String },
            color: { type: String },
            price: { type: Number },
            thumb: { type: String },
            images: { type: Array },
            quantity: { type: Number },
            sku: { type: String },
        }
    ],
}, {
    timestamps: true
});

//Export the model
const product = mongoose.model('Product', productSchema);
export default product