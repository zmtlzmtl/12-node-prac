const express = require('express');
const router = express.Router();
const Posts = require('../schemas/post');

//전체 조회
router.get("/posts", async (req, res) => {
    const posts = await Posts.find().sort({'createdAt': 1});
    const result = posts.map((post) => {
        return {
            'postId': post._id,
            'user': post.user,
            'title': post.title,
            'createdAt': post.createdAt
        }
    })
    res.json({'data': result});
})

//생성
router.post('/posts', async (req, res) => {
    const { user, password, title, content } = req.body;
    await Posts.create({ user, password, title, content });
    res.json({ 'message': '게시글이 생성되었습니다.' });
});

//특정 식별자인 id로 게시물 조회하기
router.get('/posts/:_id', async (req, res) => {
    const { _id } = req.params;
    const post = await Posts.find({ _id });
    const result = post.map((post) => {
        return {
            'postId': post._id,
            'user': post.user,
            'title': post.title,
            'content': post.content,
            'createdAt': post.createdAt
        }
    })
    res.json({'data': result});
});

//id와 password를 이용하여 게시물 수정하기
router.put('/posts/:_id', async (req, res) => {
    const { _id } = req.params;
    const { password, title, content } = req.body;
    const post = await Posts.findById( _id );  //find, findOne, findById
    console.log(post) //null 값이 왜 안나오지?

    if (post) {
        if (post.password !== password) {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }

        await Posts.updateOne({ _id }, {$set: { title, content } });
        return res.json({  "message": "게시글을 수정하였습니다."});
    }
    return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' }); 
});

router.delete('/posts/:_id', async (req, res) => {
    const { _id } = req.params;
    const { password } = req.body;
    const post = await Posts.findById(_id);
    

    if (post) {
        if (post.password !== password) {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' })
        }

        await Posts.deleteOne({ _id });
        return res.status(200).json({ message: '게시물을 삭제하였습니다.' })
    }
    return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
});



module.exports = router;