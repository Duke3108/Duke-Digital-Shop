import mongoose from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        color: String,
        price: Number,
        thumb: String,
        title: String
    }],
    status: {
        type: String,
        default: 'Cancelled',
        enum: ['Cancelled', 'Succeed']
    },
    total: Number,
    address: {
        type: String,
        required: true
    },
    orderBy: {
        type: mongoose.Types.ObjectId, ref: 'User'
    }

}, {
    timestamps: true
});

//Export the model
const order = mongoose.model('Order', orderSchema);
export default order