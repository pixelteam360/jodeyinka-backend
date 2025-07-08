"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = setupWebSocket;
const ws_1 = require("ws");
const connectionHandler_1 = require("./connectionHandler");
function setupWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (ws) => {
        console.log("WebSocket connection established");
        (0, connectionHandler_1.handleConnection)(ws, wss);
    });
    return wss;
}
