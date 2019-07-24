
const express = require("express");
const SocketServer = require('ws').Server;
const PORT = 3000;
const app = express();



app.get('/', function (req, res) {
	res.sendFile(__dirname + "/pages/index.html");
});

const server = app.listen(PORT, function () {
	console.log('Listening on PORT ' + PORT)
});

const wss = new SocketServer({ server });

var ledState = "Off";

wss.on('connection', function (ws) {
	console.log('Client connected');

	ws.on('message', function(msg) {
		console.log(msg);

		var message = JSON.parse(msg);

		if ( message.type == "client_connected" ){
			ws.type = "client";
			console.log(message.data);
			ws.send(JSON.stringify({
			type : "LED",
			data : ledState
			}));
		}else if(message.type=="node_connected"){
			ws.type = "node";
			wss.clients.forEach( function e(client){
					if(client.type == "node"){
						client.send(JSON.stringify({
							type : "LED",
							data : ledState
						}));
					}
				});

		}else if(message.type == "client"){
			if(message.data == "On"){
				// Send To HW
				wss.clients.forEach( function e(client){
					if(client.type == "node"){
						client.send(JSON.stringify({
							type : "LED",
							data : "On"
						}));
					}
				});
			}else{
				// Send to HW
				wss.clients.forEach( function e(client){
					if(client.type == "node"){
						client.send(JSON.stringify({
							type : "LED",
							data : "Off"
						}));
					}
				});
			}
		}else if(message.type == "node"){

			if(message.data == "On"){
				// Send To clients
				ledState = "On";
				wss.clients.forEach( function e(client){
					if(client.type == "client"){
						client.send(JSON.stringify({
							type : "LED",
							data : ledState
						}));
					}
				});
			}else{
				ledState = "Off";
				// Send to clients
				wss.clients.forEach( function e(client){
					if(client.type == "client"){
						client.send(JSON.stringify({
							type : "LED",
							data : ledState
						}));
					}
				});
			}
		}


	});

	ws.on('close', () => console.log('Client disconnected'));
});
