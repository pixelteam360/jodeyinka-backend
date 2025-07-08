"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastToAll = broadcastToAll;
const ws_1 = require("ws");
function broadcastToAll(wss, message) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}
