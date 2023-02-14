const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../schemas/user");

// 로그인 API
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    try {
        const user = await User.findOne({ nickname });

        // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
        if (!user || password !== user.password) {
            res.status(400).json({
                errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
            });
            return;
        }

        const token = jwt.sign(
            { Id: user.Id },
            "custom-secret-key", //환경변수이용, 깃도 퍼블릭이면 다 볼수있음 (남들이 보면 안되는것)
        );
        res.cookie("Authorization", `Bearer ${token}`);  //토큰의 인증 타입, jwt 같은 인증 방식에서의 약속
        res.status(200).json({ token });
    } catch (err) {
        console.error(err)
        res.status(200).json({
            errorMessage: "로그인에 실패하였습니다.",
        });
    }
});

module.exports = router;