var http = require('http');
var url = require("url");
var handleRequest = require("./handle");

function onRequest(request, response) {
	var postData = "";
	var pathname = url.parse(request.url).pathname;
	request.setEncoding("utf8");

	//获取提交的数据
  request.addListener("data", function(postDataChunk) {
    postData += postDataChunk;    
  });
	request.addListener("end", function() {
		handleRequest.handle(response, postData);
	})	
}

http.createServer(onRequest).listen(8888);
console.log("Server has started.");
