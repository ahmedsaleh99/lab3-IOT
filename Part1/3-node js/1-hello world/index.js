const express = require('express')
const app = express()
const PORT = 3000


app.get('/ahmed', function (request, t) {
	t.send("Hello World!");
	console.log(request);
});


app.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
})
