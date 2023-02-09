require('dotenv').config();
const { POST } = process.env;

const express = require('express')
const app = express()
const post = 3000;

const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");

const connect = require('./schemas');
connect();

app.use(express.json());
app.use("/api", [postsRouter, commentsRouter]);


app.get('/', (req, res) => {
    res.send('Helo World!')
});

app.listen(post, () => {
    console.log(post, '서버가 열렸습니다')
});

