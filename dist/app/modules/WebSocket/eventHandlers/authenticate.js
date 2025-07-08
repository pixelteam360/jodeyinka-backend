"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAuthenticate = handleAuthenticate;
const config_1 = __importDefault(require("../../../../config"));
const jwtHelpers_1 = require("../../../../helpars/jwtHelpers");
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const utils_1 = require("../utils");
const onlineUsers = new Set();
const userSockets = new Map();
function handleAuthenticate(ws, data, wss) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = data.token;
        if (!token)
            return ws.send(JSON.stringify({ event: "error", message: "No token provided" }));
        const user = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_secret);
        if (!user)
            return ws.send(JSON.stringify({ event: "error", message: "Invalid token" }));
        const userData = yield prisma_1.default.user.findFirst({ where: { id: user.id } });
        if (!userData)
            return ws.send(JSON.stringify({ event: "error", message: "User not found" }));
        ws.userId = user.id;
        onlineUsers.add(user.id);
        userSockets.set(user.id, ws);
        (0, utils_1.broadcastToAll)(wss, {
            event: "userStatus",
            data: { userId: user.id, isOnline: true },
        });
    });
}
