import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";
import { userSockets } from "./authenticate";

export async function messageToAdmin(ws: ExtendedWebSocket, data: any) {
  const { message, images } = data;
  console.log(message);

  const receiver = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
    select: { id: true, role: true },
  });

  console.log(receiver);
  const receiverId = receiver?.id;

  if (!ws.userId || !receiverId || !message) {
    return ws.send(
      JSON.stringify({ event: "error", message: "Invalid message payload" })
    );
  }

  let room = await prisma.room.findFirst({
    where: {
      OR: [
        { senderId: ws.userId, receiverId },
        { senderId: receiverId, receiverId: ws.userId },
      ],
    },
  });

  if (!room) {
    room = await prisma.room.create({
      data: { senderId: ws.userId, receiverId },
    });
  }

  const chat = await prisma.chat.create({
    data: {
      senderId: ws.userId,
      receiverId,
      roomId: room.id,
      message,
      images: images || "",
    },
  });

  const receiverSocket = userSockets.get(receiverId);

  if (receiverSocket) {
    receiverSocket.send(JSON.stringify({ event: "messageToAdmin", data: chat }));
  }
  ws.send(JSON.stringify({ event: "messageToAdmin", data: chat }));
}
