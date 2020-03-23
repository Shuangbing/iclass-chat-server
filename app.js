const express = require('express')
const app = express()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.use(require('cors')())

app.use('/static', express.static('public'))

io.set('heartbeat interval', 5000)
io.set('heartbeat timeout', 15000)

io.on('connection', function (socket) {
    sendServerInfo(io)

    socket.on('sendMessage', function (msg) {
        msg.timestamp = Date.now()
        socket.broadcast.emit("reciveMessage", msg); 
    });

    socket.on('getServerInfo', () => {
        sendServerInfo(io)
    })
});

function sendServerInfo(io) {
    io.emit('reciveServerInfo', {
        online: io.engine.clientsCount
    })
}

http.listen(process.env.PORT || 3000, function () {
    console.log('listening on *:3000');
});