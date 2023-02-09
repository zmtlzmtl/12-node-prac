const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: {           //_로 시작하면 안읽힘, 
        type: String,
        reqiured: true
    },
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("comment", commentSchema);