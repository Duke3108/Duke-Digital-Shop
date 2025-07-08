import mongoose from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    numberViews: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: {
        type: String,
        default: 'https://www.nsamedia.com/wp-content/uploads/2015/10/blog-bg-use.jpg'
    },
    author: {
        type: String,
        default: 'Admin'
    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Export the model
const blog = mongoose.model('Blog', blogSchema);
export default blog