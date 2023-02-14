const express = require('express');
const router = express.Router();
const Posts = require("../schemas/post")
const Comments = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");

//생성
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
    const { userId, nickname } = res.locals.user;
    const { postId }  = req.params;
    const { comment } = req.body;             
    const maxBycommentId = await Comments.findOne({ postId }).sort("-commentId").exec();  //post마다 commentId가 1부터 시작하게 만들고싶은거임
    const commentId = maxBycommentId ? maxBycommentId.commentId + 1 : 1;   //post경우에는 null이였는데, 여기선 post가 존재할 때도 더해주는 거니까. NaN + 1 === NaN
    if (!comment) {
        return res.json({ errormessage: "데이터 형식이 올바르지 않습니다." });
    };
    await Comments.create({ 
        commentId, 
        postId, 
        userId, 
        nickname,
        comment
    });
    return res.json({ "message": "댓글을 생성하였습니다." });
});

// 조회
router.get('/posts/:postId/comments', async (req, res) => {   //파람을 8로 넣어도 []빈배열 조회 에러로 막아야함 comments.length === 0
    const { postId } = req.params;
    try {
        const comments = await Comments.find({ postId }).sort('-commentId');
        if (!comments || comments.length === 0) {   //이것도 확립이 필요하다. 사실 뒤에만 써도 될듯 
            return res.status(400).json({ errmessage: '댓글이 존재하지 않습니다.' });
        }
        const result = comments.map((comment) => {
            return {
                'commentId': comment.commentId,
                'userId': comment.userId,
                'nickname': comment.nickname,
                'comment': comment.comment,
                'createdAt': comment.createdAt,
                'updatedAt': comment.updatedAt,
            }
        })
        res.json({ 'comments': result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '나도 뭔지 모르겠습니다.' });
    }
});

//쿠키 데이터를 이용하여 게시물 수정하기
router.put('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    const updateComment = await Comments.findOne({ postId, commentId });  // 2,3 params로 받아왔는데 1,1 이 수정됨 (설마 업데이트?)

    if (updateComment.userId !== userId) {
        return res.status(400).json({ message: '수정 권한이 없습니다.' });
    }
    if (!updateComment) {
        return res.status(400).json({ message: '댓글이 존재하지 않습니다.' });
    }
    await Comments.updateOne({ userId, postId, commentId }, { $set: { comment } });  //업데이트 조건에 세가지를 안적고 userID만 적었더니 해당하는 것에 맨위에것이 삭제되었다.
    return res.json({ "message": "게시글을 수정하였습니다." });
});


//쿠키 데이터를 이용하여 게시물 삭제하기
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;

    const comment = await Comments.findOne({ postId, commentId });

    if (!comment) {
        return res.status(400).json({ message: '댓글이 존재하지 않습니다.' });
    }
    if (comment.userId !== userId) {
        return res.status(400).json({ message: '삭제 권한이 없습니다.' });
    }
    await Comments.deleteOne({ userId, postId, commentId });               
    return res.status(200).json({ message: '게시물을 삭제하였습니다.' });
});

module.exports = router;