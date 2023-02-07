const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Helo World!')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
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

