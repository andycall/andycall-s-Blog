var http = require('http');

var ccap = require('ccap')();


http.createServer(function(request, response){
	if(request.url == "/favicon.ico") return response.end('');

	var ary = ccap.get();

	var text = ary[0];

	var buf = ary[1];

	response.end(buf);

	console.log(text);
}).listen(4000);

console.log("Server running at http://localhost:4000");