const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({  
    postId: {
        type: Number,
        required: true,
    },
    nickname: { 
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('post', postSchema);