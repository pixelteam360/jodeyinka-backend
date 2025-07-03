import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

export async function handleUnReadMessages(ws: ExtendedWebSocket, data: any) {
  const { receiverId } = data;
  if (!ws.userId || !receiverId) {
    console.log("Invalid unread messages payload");
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
    ws.send(JSON.stringify({ event: "noUnreadMessages", data: [] }));
    return;
  }

  const unReadMessages = await prisma.chat.findMany({
    where: {
      roomId: room.id,
      isRead: false,
      receiverId: ws.userId,
    },
  });

  const unReadCount = unReadMessages.length;

  ws.send(
    JSON.stringify({
      event: "unReadMessages",
      data: { messages: unReadMessages, count: unReadCount },
    })
  );
}
