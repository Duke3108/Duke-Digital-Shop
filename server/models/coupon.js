import mongoose from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discount: {
        type: Number,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },

}, {
    timestamps: true
});

//Export the model
const coupon = mongoose.model('Coupon', couponSchema);
export default coupon