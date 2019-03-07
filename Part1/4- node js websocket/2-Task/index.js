const express = require("express");
const SocketServer = require('ws').Server;

const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/pages/index.html");
});

const server = app.listen(PORT, function () {
	console.log('Listening on PORT ' + PORT)
});

const wss = new SocketServer({ server });
var status = 0;

wss.on('connection', function (ws) {
	console.log('Client connected');
	ws.send(JSON.stringify({
		type : "LED",
		data : status
	}));
	ws.on('message', function (msg) {
		console.log('msg recieved');
		let message = JSON.parse(msg);
		if(message.type == "LED"){
			status = message.data;
			wss.clients.forEach( function e(client){
				if (client.readyState === client.OPEN) { // if client still connected
					client.send(JSON.stringify({
						type : "LED",
						data : status
					}));
				}
			});
		}
	});
	ws.on('close', function () {
		console.log('Client disconnected')
	});
});
