const jwt = require("jsonwebtoken");
const Users = require("../schemas/user");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;

  //undifined.spit()는 에러가 나온다
  const [authType, authToken] = (Authorization ?? "").split(" "); //Authorization가 undified면 빈문자열 "" 반환, 그래서 split할때 에러가 안남
  // ?? => 널병합 문자열  왼쪽의 값이 비엇거나 null일때 오른쪽으로 바꿔줌
  //Bearer과 token을 나눠주는것

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
  //jwt검증 중 서버가 끊기지 않게 try catch
  try {
    const { Id } = jwt.verify(authToken, "custom-secret-key"); //토큰이 만료되었는지, 서버에서 발급한 토큰이 맞는지
    const user = await Users.findById(Id); //토큰에 있는 userId에 해당하는 사용자가 DB에 존재하는지
    
    res.locals.user = user; //굳이 DB에서 사용자정보를 가져오지않고 express가 제공하는 안전한 변수에 담아 사용한다.
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};