import mongoose from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        count: Number,
        color: String,
    }],
    status: {
        type: String,
        default: 'Processing',
        emum: ['Cancelled', 'Processing', 'Succeed']
    },
    total: Number,
    coupon: {
        type: mongoose.Types.ObjectId, ref: 'Coupon'
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