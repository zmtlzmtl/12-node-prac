require('dotenv').config();
const { POST } = process.env;

const express = require('express')
const app = express()
const post = 3000;

const postsRouter = require("./routes/posts");

const connect = require('./schemas');
connect();

app.use(express.json());
app.use("/api", [postsRouter]);


app.get('/', (req, res) => {
    res.send('Helo World!')
});

app.post('/', function (req, res) {
    res.send('Got a POST request');
});

app.put('/user', function (req, res) {
    res.send('Got a put request at /user');
});

app.delete('/user', function (req, res) {
    res.send("Got a DELETE request at /user");
});


app.listen(post, () => {
    console.log(post, '서버가 열렸습니다')
});

