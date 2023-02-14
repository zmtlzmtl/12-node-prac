const express = require('express');
const router = express.Router();
const Users = require("../schemas/user");
const Posts = require('../schemas/post');
const authMiddleware = require("../middlewares/auth-middleware");

//전체 조회
router.get("/posts", async (req, res) => {
    try {                     //await앞에 try; 
        const posts = await Posts.find().sort({ 'createdAt': -1 });

        if (!posts.length) {
            res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다." });
        };
        const result = posts.map((post) => {
            return {
                'postId': post.postId,
                'userId': post.userId,
                'nickname': post.nickname,
                'title': post.title,
                'content': post.content,
                'createdAt': post.createdAt
                //"updatedAt" 어떻게 집어넣을까? post.updatedAt
            }
        }) 
        res.json({'data': result});
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: "게시글 조회에 실패하였습니다." });
    }
})


//생성
router.post('/posts', authMiddleware, async (req, res) => {
    const _Id = res.locals.user.userId; //바로 꺼내어 써도됨 { userId, nickname }
    const { title, content } = req.body;
    const { userId, nickname } = await Users.findOne({ _Id });
    const maxBypostId = await Posts.findOne().sort("-postId").exec();
    const postId = maxBypostId ? maxBypostId.postId + 1 : 1;
    console.log(maxBypostId, postId)

    const existsUsers = await Users.findOne({ _Id });
    if (!existsUsers) {
        return res.status(400).json({
              errorMessage: "로그인이 필요한 기능입니다."
          });
        }
    if (!(title && content)) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    await Posts.create({ postId, userId, nickname, title, content });
    res.status(200).json({ 'message': '게시글을 생성하였습니다.' });
});

//특정 식별자인 id로 게시물 조회하기
router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.find({ postId }); //물어보기 data {} 형식 , console.log(post) 안나오는지

    if (!post) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    const result = post.map((post) => {  //findOne을 사용하면 map을 돌리지 못한다.
        return {
            'postId': post.postId,
            'userId': post.userId,
            'nickname': post.nickname,
            'title': post.title,
            'content': post.content,
            'createdAt': post.createdAt,
            //"updatedAt": Date.now ?? 어떻게 집어넣을까?
        }
    })
    res.json({ 'post': result });
});

//쿠키 데이터를 이용하여 게시물 수정하기
router.put('/posts/:postId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { title, content } = req.body;
    const post = await Posts.findOne({ postId });

    // console.log(userId, post.userId)
    if (!post) {
        return res.status(400).json({ message: '게시물이 존재하지 않습니다.' });
    }
    if (post.userId !== userId) {
        return res.status(400).json({ message: '수정 권한이 없습니다.' });
    }
    await Posts.updateOne({ postId }, { $set: { title, content } });
    return res.json({ "message": "게시글을 수정하였습니다." });
});

//쿠키 데이터를 이용하여 게시물 삭제하기
router.delete('/posts/:postId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;

    const post = await Posts.findOne({ userId, postId });

    if (!post) {
        return res.status(400).json({ message: '게시물이 존재하지 않습니다.' });
    }
    if (post.userId !== userId) {
        return res.status(400).json({ message: '삭제 권한이 없습니다.' });
    }
    await Posts.deleteOne({ userId, postId });
    return res.status(200).json({ message: '게시물을 삭제하였습니다.' });
});

module.exports = router;