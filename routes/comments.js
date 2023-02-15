const express = require('express');
const router = express.Router();
const Comments = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");

//생성
router.post('/posts/:postId/comments', authMiddleware, async (req, res) => {
    const { userId, nickname } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;
    try {
        const maxBycommentId = await Comments.findOne({ postId }).sort("-commentId").exec();  //post마다 commentId가 1부터 시작하게 만들고싶은거임
        const commentId = maxBycommentId ? maxBycommentId.commentId + 1 : 1;   //post경우에는 null이였는데, 여기선 post가 존재할 때도 더해주는 거니까. NaN + 1 === NaN
    
        if (!comment) {
            return res.status(412).json({ errormessage: "데이터 형식이 올바르지 않습니다." });
        };
        await Comments.create({
            commentId,
            postId,
            userId,
            nickname,
            comment
        });
        return res.status(200).json({ "message": "댓글을 생성하였습니다." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '댓글 작성에 실패하였습니다.' });
    }
});

// 상세조회
router.get('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    try {
        const comment = await Comments.findOne({ postId }).sort('-commentId');
        
        if (Object.keys(comment).length === 0) {   // findOne은 객체반환, 객체의 길이구하기, 혜민님이 그때 다르게 했던거 같은데, 물어봐야지
            return res.status(412).json({ errmessage: '댓글이 존재하지 않습니다.' });
        }
        res.json({ 'comment': comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '댓글 조회에 실패하였습니다.' });  //없는 postId를 넣었는데 500err 반환...??? (null값이 나옴)
    }
});

//쿠키 데이터를 이용하여 게시물 수정하기
router.put('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    const { comment } = req.body;
    try {
        const updateComment = await Comments.findOne({ postId, commentId });  // 2,3 params로 받아왔는데 1,1 이 수정됨 (설마 업데이트?) userId를 안적어 줬었단다.
        if (updateComment.userId !== userId) {
            return res.status(403).json({ errmessage: '로그인이 필요한 기능입니다.' });        //updateComment는 해당 유저가 아니면 게시물을 찾지도 못함 게시물이 없음(but 안나와도 끝까지는 도니까)
        }                                                           // 로그인이 필요한 기능입니다가 들어가야하는게 게시물의 ID와 일치하는지 확인해야함. 미들웨어는 그 검사가 아님
        if (!comment) {
            return res.status(412).json({ errmessage: '데이터 형식이 올바르지 않습니다.' }); 
        }
        if (Object.keys(updateComment).length === 0) { 
            return res.status(404).json({ errmessage: '댓글이 존재하지 않습니다.' });
        }
        await Comments.updateOne({ postId, commentId }, { $set: { comment } });   //commentId 명명을 다르게 순서니까 (다음에, 이번엔 주어졌으니)
        return res.json({ message: "댓글을 수정하였습니다." });                                 //이부분을 userId가 달라도 보일수가있네
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '댓글 수정에 실패하였습니다.' });
    }
});


//쿠키 데이터를 이용하여 게시물 삭제하기
router.delete('/posts/:postId/comments/:commentId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { postId, commentId } = req.params;
    try {
        const comment = await Comments.findOne({ postId, commentId });  //조건과 결과를 찾는게 다르면 안됨  //해당 게시물의 해당 댓글은 하나밖에없음 1.1, 2.1, ..., 다 다름

        if (!comment) {
            return res.status(412).json({ errmessage: '댓글이 존재하지 않습니다.' });
        }
        if (comment.userId !== userId) {
            return res.status(403).json({ errmessage: '로그인이 필요한 기능입니다.' });  //403은 허용하지않은
        }
        await Comments.deleteOne({ postId, commentId });                //조건과 결과를 찾는게 다르면 안됨
        return res.status(200).json({ message: '댓글을 삭제하였습니다.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '댓글 삭제에 실패하였습니다.' });
    }
});

module.exports = router;