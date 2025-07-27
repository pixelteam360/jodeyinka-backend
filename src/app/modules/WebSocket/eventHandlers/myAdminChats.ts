import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const onlineUsers = new Set<string>();

export async function myAdminChats(ws: ExtendedWebSocket, data: any) {
  if (!ws.userId) {
    console.log("User not authenticated");
    return;
  }

  const admin = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
    select: { id: true },
  });

  const receiverId = admin?.id;

  const room = await prisma.room.findFirst({
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

  const chats = await prisma.chat.findMany({
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

  await prisma.chat.updateMany({
    where: { roomId: room.id, receiverId: ws.userId },
    data: { isRead: true },
  });

  ws.send(
    JSON.stringify({
      event: "fetchChats",
      data: chats,
      onlineUsers: onlineUsers.has(admin?.id!),
    })
  );
}
