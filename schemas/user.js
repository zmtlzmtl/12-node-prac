const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({ //회원가입 할 때 DB에 넣고싶은것
  nickname: { // nickname 필드 
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: Number,
    required: true,
    unique: true,
},
  password: { // password 필드
    type: String,
  },
});

// 가상의 userId 값을 할당
UserSchema.virtual("Id").get(function () {   //화살표함수 왜 안됐을까?
  return this._id.toHexString();
});

// user 정보를 JSON으로 형변환 할 때 virtual 값이 출력되도록 설정
UserSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("User", UserSchema);