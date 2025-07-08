import mongoose from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var billSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

}, {
    timestamps: true
});

//Export the model
const bill = mongoose.model('Bill', billSchema);
export default bill