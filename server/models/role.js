import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var roleSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    value: {
        type: String,
        required: true,
        unique: true,
    },
});

const role = mongoose.model('Role', roleSchema);

export default role;