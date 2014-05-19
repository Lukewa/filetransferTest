var WebSocketServer = require('websocket').server;
var http = require('http');
var config = require('./config.js');
var counter = 0;
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(config.port, config.host, function() {
    console.log((new Date()) + ' Server is listening on port ' + config.port + ' on address: ' + config.host);
});

wsServer = new WebSocketServer({
    httpServer: server,
    maxReceivedMessageSize: 1073741824,  // 1gb
    maxReceivedFrameSize: 1048576, // 1mb
    fragmentOutgoingMessages: true,
    fragmentationThreshold: 16348,
    assembleFragments: true,
    keepalive: true,
    dropConnectionOnKeepaliveTimeout: true,
    keepaliveGracePeriod: 10000,
    autoAcceptConnections: false,
    closeTimeout: 5000,
    disableNagleAlgorithm: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            counter++;
            console.log('counter:', counter);
            // connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	console.log('Reasoncode: ' + reasonCode);
    });
    connection.on('error', function(err) {
	console.log('Error detected');
	console.log(err);
    });
});

// wsServer.on('data', function())
