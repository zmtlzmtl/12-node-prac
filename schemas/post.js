const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({  //게시물을 생성할 때 DB에 넣고싶은것
    postId: {
        type: Number,
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
    title: {
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

module.exports = mongoose.model('post', postSchema);