const express = require('express')
const app = express()
const PORT = 8000


app.get('/', function (req, res) {
	res.sendFile(__dirname + "/pages/index.html");
});

app.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
})
