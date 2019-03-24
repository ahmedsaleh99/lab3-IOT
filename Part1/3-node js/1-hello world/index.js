const express = require('express')
const app = express()
const PORT = 3000
app.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
})


app.get('/ahmed', function (request, responde) {
	responde.send("Hello ahmed!");
	console.log(request);
});
app.get('/', function (request, responde) {
	responde.send("Hello World!");
	console.log(request);
});



