import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const onlineUsers = new Set<string>();

export async function handleFetchChats(ws: ExtendedWebSocket, data: any) {
  const { receiverId } = data;
  if (!ws.userId) {
    console.log("User not authenticated");
    return;
  }

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
      onlineUsers: onlineUsers.has(receiverId),
    })
  );
}
