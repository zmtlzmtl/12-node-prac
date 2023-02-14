const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentId: {
        type: Number,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    nickname: { // nickname 필드 
        type: String,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);