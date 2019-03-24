const express = require("express");
const app = express();

const PORT = 8000;

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/pages/index.html");
});

const server = app.listen(PORT, function () {
	console.log('Listening on PORT ' + PORT)
});

var WebSocketServer = require('ws').Server;
wss = new WebSocketServer({server});

wss.on('connection', function (wsclient) {

  wsclient.on('message', function (message) {
    console.log('received: %s', message)
		wsclient.send("echomessage");
  });
});
