const express = require('express');
const router = express.Router();
const Comments = require("../schemas/comment");

//생성
router.post('/comments/:postId', async (req, res) => {
    const { postId }  = req.params;              //이 값을 데이터에 못가지고 들어가나?
    const { user, password, content } = req.body;
    if (!(user && password && content)) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
    await Comments.create({postId, user, password, content});  // 여기에 postId를 적으면 안들어가나?
    return res.json({ "message": "댓글을 생성하였습니다." });

});

// 조회
router.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params;
    try {
        const comment = await Comments.find({ postId }).sort({ "createdAt": -1 });
        const result = comment.map((comment) => {
            return {
                "commentsId": comment._id,
                "user": comment.user,
                "content": comment.content,
                "createdAt": comment.createdAt
            };
        })
        res.json({ "data": result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '나도 뭔지 모르겠습니다.' });
    }
});

//수정하기
router.put('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { password, content } = req.body;
    const comment = await Comments.findById( commentId );

    if (comment) {
        if (comment.password !== password) {
            return res.json({ "message": "비밀번호가 틀립니다." })
        };
        await Comments.updateOne({ commentId }, { $set: { content } })
        return res.json({ "message": "댓글을 수정하였습니다." })
    }
    return res.json({ "message": "댓글 조회에 실패하였습니다." })
});

//삭제하기
router.delete('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;
    const comment = await Comments.findById( commentId );

    if (comment) {
        if (comment.password !== password) {
            return res.json({ "message": "비밀번호가 틀립니다." })
        };
        await Comments.deleteOne({ commentId })
        return res.json({ "message": "댓글을 삭제하였습니다." })
    }
    return res.json({ "message": "댓글 조회에 실패하였습니다." })
});

module.exports = router;