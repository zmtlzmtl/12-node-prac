require('dotenv').config();
const { URI } = process.env;

const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(URI)
    .catch(err => console.log(err));
}
mongoose.set('strictQuery',true) 
mongoose.connection.on("error", err => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;


// mongodb+srv://test:<password>@cluster0.uazu7ta.mongodb.net/?retryWrites=true&w=majority
// [MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. Or use `mongoose.set('strictQuery', true);` to suppress this warning.
