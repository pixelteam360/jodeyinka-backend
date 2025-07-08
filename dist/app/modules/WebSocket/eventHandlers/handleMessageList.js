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
exports.handleMessageList = handleMessageList;
const prisma_1 = __importDefault(require("../../../../shared/prisma"));
const onlineUsers = new Set();
function handleMessageList(ws) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch all rooms where the user is involved
            const rooms = yield prisma_1.default.room.findMany({
                where: {
                    OR: [{ senderId: ws.userId }, { receiverId: ws.userId }],
                },
                include: {
                    chat: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1, // Fetch only the latest message for each room
                    },
                },
            });
            // Extract the relevant user IDs from the rooms
            const userIds = rooms.map((room) => {
                return room.senderId === ws.userId ? room.receiverId : room.senderId;
            });
            // Fetch user for the corresponding user IDs
            const userInfos = yield prisma_1.default.user.findMany({
                where: {
                    id: {
                        in: userIds,
                    },
                },
                select: {
                    id: true,
                    fullName: true,
                    image: true,
                },
            });
            // Combine user info with their last message
            const userWithLastMessages = rooms.map((room) => {
                const otherprofileId = room.senderId === ws.userId ? room.receiverId : room.senderId;
                const userInfo = userInfos.find((userInfo) => userInfo.id === otherprofileId);
                return {
                    user: userInfo || null,
                    lastMessage: room.chat[0] || null,
                    onlineUsers: onlineUsers.has(userInfo === null || userInfo === void 0 ? void 0 : userInfo.id),
                };
            });
            // Send the result back to the requesting client
            ws.send(JSON.stringify({
                event: "messageList",
                data: userWithLastMessages,
            }));
        }
        catch (error) {
            console.error("Error fetching user list with last messages:", error);
            ws.send(JSON.stringify({
                event: "error",
                message: "Failed to fetch users with last messages",
            }));
        }
    });
}
