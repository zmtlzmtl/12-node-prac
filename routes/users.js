const express = require("express");
const router = express.Router();

const Users = require("../schemas/user");

// 회원가입 API
router.post("/signup", async (req, res) => {
    const { nickname, password, confirm } = req.body;
    const maxByUserId = await Users.findOne().sort("-order").exec();
    const userId = maxByUserId ? maxByUserId.userId + 1 : 1;

    //패스워드 확인
    try {
        if (password !== confirm) {
            return res.status(400).json({
                errorMessage: "패스워드가 일치하지 않습니다.",
            });
        }
        // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
        const existsUsers = await Users.findOne({ nickname }) // A또는 B가 일치할 떄, 조회한다.

        if (existsUsers) {
            // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다. 일부러 
            return res.status(400).json({
                errorMessage: "닉네임이 이미 사용중입니다.",
            });
        }
        const user = new Users({ userId, nickname, password }); //원래는 단방향 암호화를 거쳐 비밀번호 보내줌(여기선 아님)
        await user.save();

        res.status(201).json({ Message: "회원가입이 완료되었습니다."});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '나도 뭔지 모르겠습니다.' });
    }
});

module.exports = router;