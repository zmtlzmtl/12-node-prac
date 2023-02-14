const express = require("express");
const router = express.Router();

const Users = require("../schemas/user");

// 회원가입 API
router.post("/signup", async (req, res) => {
    const { nickname, password, confirm } = req.body;
    try {
    const maxByUserId = await Users.findOne().sort("-userId").exec();
    const userId = maxByUserId ? maxByUserId.userId + 1 : 1;
    const nameCheck = /^[a-zA-Z0-9]{4,}$/; //공백없는 숫자와 대소문자
    
        if (!nameCheck.test(nickname)) {
            return res.status(400).json({
                errorMessage: "닉네임의 형식이 일치하지 않습니다.",
            });
        }
        if (password.length < 4) {
            return res.status(400).json({
                errorMessage: "패스워드 형식이 일치하지 않습니다.",
            });
        }
        if (password !== confirm) {
            return res.status(400).json({
                errorMessage: "패스워드가 일치하지 않습니다.",
            });
        }
        if (password.includes(nickname)) {
            return res.status(400).json({
                errorMessage: "패스워드에 닉네임이 포함되어 있습니다.",
            });
        }
        const existsUsers = await Users.findOne({ nickname });

        if (existsUsers) {
            // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않습니다. 일부러 
            return res.status(400).json({
                errorMessage: "중복된 닉네임입니다.",
            });
        }
        const user = new Users({ userId, nickname, password });
        await user.save();

        res.status(201).json({ message: "회원가입이 완료되었습니다."});
    } catch (err) {
        console.error(err);
        res.status(500).json({ errmessage: '요청한 데이터 형식이 올바르지 않습니다.' });
    }
});

module.exports = router;