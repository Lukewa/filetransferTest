var WebSocketClient = require('websocket').client;
var fs = require('fs');
var config = require('./config.js');

var client = new WebSocketClient({
    maxReceivedMessageSize: 1073741824,  // 1gb
    maxReceivedFrameSize: 1048576, // 1mb
    fragmentOutgoingMessages: true,
    fragmentationThreshold: 16348,
    assembleFragments: true,
    closeTimeout: 5000
});

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    console.log(error);
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });

    sendBigTestMessage(connection);
});

function sendBigTestMessage(connection) {
    var textMessage =  "Lorem ipsum dolor sit amet, consetetur sadi"
        + "pscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et do"
        + "lore magna aliquyam erat, sed diam voluptua. At vero eos et accusam e"
        + "t justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea ta"
        + "kimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit "
        + "amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor "
        + "invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
        + "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita"
        + "kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. "
        + "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy"
        + "eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam "
        + "voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet "
        + "clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   "
        + "Duis autem vel eum iriure dolor in hendrerit in vulputate velit ess"
        + "e molestie consequat, vel illum dolore eu feugiat nulla facilisis at"
        + "vero eros et accumsan et iusto odio dignissim qui blandit praesent l"
        + "uptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lo"
        + "rem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy "
        + "nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   "
        + "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorpe"
        + "r suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis au"
        + "tem vel eum iriure dolor in hendrerit in vulputate velit esse molesti"
        + "e consequat, vel illum dolore eu feugiat nulla facilisis at vero eros"
        + "et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril "
        + "delenit augue duis dolore te feugait nulla facilisi.   "
        + "Nam liber tempor cum soluta nobis eleifend option congue nihil impe"
        + "rdiet doming id quod mazim placerat facer possim assum. Lorem ipsum "
        + "dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh e"
        + "uismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wi"
        + "si enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit "
        + "lobortis nisl ut aliquip ex ea commodo consequat.   "
        + "Duis autem vel eum iriure dolor in hendrerit in vulputate velit ess"
        + "e molestie consequat, vel illum dolore eu feugiat nulla facilisis.  "
        + "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita"
        + "kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit a";

    for (var i = 10; i >= 0; i--) {
        textMessage = textMessage + textMessage;
    };
    connection.send(textMessage, function(err) {
        console.log('Message was sent....');
        console.log(err);
        console.log('done');
    });
};

// IPv6
client.connect('ws://' + '[' + config.host + ']' + ':' + config.port + '/', 'echo-protocol');

// IPv4
// client.connect('ws://' + config.host + ':' + 'config.server' + '/', 'echo-protocol');