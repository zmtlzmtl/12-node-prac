const express = require('express');
const router = express.Router();
const Comments = require("../schemas/comment");
const Posts = require("../schemas/post.js");

//생성
router.post('/comments/:postId', async (req, res) => {
    const {postId} = req.params;
    const { user, password, content } = req.body;
    if (!(user && password && content)) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    await Comments.create({ postId, user, password, content });
    res.json({ 'message': '게시글을 생성하였습니다.' });
});