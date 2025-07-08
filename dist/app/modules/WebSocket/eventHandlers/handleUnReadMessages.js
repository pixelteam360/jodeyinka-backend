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
exports.handleUnReadMessages = handleUnReadMessages;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
function handleUnReadMessages(ws, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { receiverId } = data;
        if (!ws.userId || !receiverId) {
            console.log("Invalid unread messages payload");
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
            ws.send(JSON.stringify({ event: "noUnreadMessages", data: [] }));
            return;
        }
        const unReadMessages = yield prisma_1.default.chat.findMany({
            where: {
                roomId: room.id,
                isRead: false,
                receiverId: ws.userId,
            },
        });
        const unReadCount = unReadMessages.length;
        ws.send(JSON.stringify({
            event: "unReadMessages",
            data: { messages: unReadMessages, count: unReadCount },
        }));
    });
}
