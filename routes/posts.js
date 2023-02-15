const express = require('express');
const router = express.Router();
const Posts = require('../schemas/post');
const authMiddleware = require("../middlewares/auth-middleware");

//전체 조회
router.get("/posts", async (req, res) => {
    try {                     
        const posts = await Posts.find().sort({ 'createdAt': -1 });   //DB를 2번 들어간다. or schema에 중복된 값을 저장시켜준다. (상황마다 다르게 쓰여야한다 (메모리사용))
                                                                  
        if (!posts.length) {
            res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
        };
        res.json({'posts': posts});
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
})


//생성
router.post('/posts', authMiddleware, async (req, res) => {
    const { userId, nickname } = res.locals.user;
    const { title, content } = req.body;
    try {
        const maxBypostId = await Posts.findOne().sort("-postId").exec();
        const postId = maxBypostId ? maxBypostId.postId + 1 : 1;
        if (!userId) {
            return res.status(403).json({ errmessage: "로그인이 필요한 기능입니다."});
        }
        if (!title) {
            return res.status(412).json({ errmessage: '게시글 제목의 형식이 일치하지 않습니다.' });
        }
        if (!content) {
            return res.status(412).json({ errmessage: '게시글 내용의 형식이 일치하지 않습니다.' });
        }
        await Posts.create({ postId, userId, nickname, title, content });
        res.status(200).json({ message: '게시글을 생성하였습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '게시글 작성에 실패하였습니다.' });
    }
});

//특정 식별자인 id로 게시물 조회하기
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await Posts.findOne({ postId });

        if (!post) {
            return res.status(400).json({ errmessage: '게시글 조회에 실패하였습니다.' });
        }
        res.json({ 'post': post });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '게시글 조회에 실패하였습니다.' });
    }
});

//쿠키 데이터를 이용하여 게시물 수정하기
router.put('/posts/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    try {
        const post = await Posts.findOne({ postId });

        if (!post) {
            return res.status(412).json({ errmessage: '게시물이 존재하지 않습니다.' });
        }
        if (!title) {
            return res.status(412).json({ errmessage: '게시글 제목의 형식이 일치하지 않습니다.' });
        }
        if (!content) {
            return res.status(412).json({ errmessage: '게시글 내용의 형식이 일치하지 않습니다.' });
        }
        await Posts.updateOne({ postId }, { $set: { title, content } });
        return res.status(200).json({ "message": "게시글을 수정하였습니다." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '게시글 수정에 실패하였습니다.' });
    }
});

//쿠키 데이터를 이용하여 게시물 삭제하기
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    try {
        const post = await Posts.findOne({ userId, postId });

        if (!post) {
            return res.status(412).json({ message: '게시물이 존재하지 않습니다.' });
        }
        await Posts.deleteOne({ userId, postId });
        return res.status(200).json({ message: '게시물을 삭제하였습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '게시물 삭제에 실패하였습니다.' });
    }
});

module.exports = router;