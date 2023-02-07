require('dotenv').config();
const { MONGODB_URI } = process.env;

const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(MONGODB_URI)
    .catch(err => console.log(err));
}

mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;



// mongodb+srv://test:<password>@cluster0.uazu7ta.mongodb.net/?retryWrites=true&w=majority
