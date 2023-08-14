import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8088 });
wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    console.log(ws);
    ws.send('something 2023..');
});
//# sourceMappingURL=websocket.js.map