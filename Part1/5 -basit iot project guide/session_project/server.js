const express = require('express');
const SocketServer = require('ws').Server;
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '/pages/client.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server });

wss.on('connection', (ws) => {
	console.log('Client connected');
	
	ws.on('message', function(msg) {
		console.log(msg);
		
		var message = JSON.parse(msg);
		
		if ( message.type == "client_connected" ){
			ws.type = "client";
			console.log(message.data);
		}else if(message.type == "LED"){
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
		}else if(message.type=="node_connected"){
			ws.type = "node";
			
		}
		
		
	});
	
	ws.on('close', () => console.log('Client disconnected'));
});