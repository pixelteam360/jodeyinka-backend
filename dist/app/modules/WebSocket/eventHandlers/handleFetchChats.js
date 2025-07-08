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
exports.handleFetchChats = handleFetchChats;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const onlineUsers = new Set();
function handleFetchChats(ws, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { receiverId } = data;
        if (!ws.userId) {
            console.log("User not authenticated");
            return;
        }
        const room = yield prisma_1.default.room.findFirst({
            where: {
                OR: [
                    { senderId: ws.userId, receiverId },
                    { senderId: receiverId, receiverId: ws.userId },
                ],
            },
        });
        if (!room) {
            ws.send(JSON.stringify({ event: "fetchChats", data: [] }));
            return;
        }
        const chats = yield prisma_1.default.chat.findMany({
            where: { roomId: room.id },
            orderBy: { createdAt: "asc" },
            select: {
                id: true,
                message: true,
                images: true,
                createdAt: true,
                updatedAt: true,
                receiverId: true,
                senderId: true,
                isRead: true,
                receiver: { select: { image: true, fullName: true } },
                sender: { select: { image: true, fullName: true } },
            },
        });
        yield prisma_1.default.chat.updateMany({
            where: { roomId: room.id, receiverId: ws.userId },
            data: { isRead: true },
        });
        ws.send(JSON.stringify({
            event: "fetchChats",
            data: chats,
            onlineUsers: onlineUsers.has(receiverId),
        }));
    });
}
