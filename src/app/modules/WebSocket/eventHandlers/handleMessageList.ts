import prisma from "../../../../shared/prisma";
import { ExtendedWebSocket } from "../types";

const onlineUsers = new Set<string>();

export async function handleMessageList(ws: ExtendedWebSocket) {
  try {
    // Fetch all rooms where the user is involved
    const rooms = await prisma.room.findMany({
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
    const userInfos = await prisma.user.findMany({
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
      const otherprofileId =
        room.senderId === ws.userId ? room.receiverId : room.senderId;

      const userInfo = userInfos.find(
        (userInfo) => userInfo.id === otherprofileId
      );

      return {
        user: userInfo || null,
        lastMessage: room.chat[0] || null,
        onlineUsers: onlineUsers.has(userInfo?.id as string),
      };
    });

    // Send the result back to the requesting client
    ws.send(
      JSON.stringify({
        event: "messageList",
        data: userWithLastMessages,
      })
    );
  } catch (error) {
    console.error("Error fetching user list with last messages:", error);
    ws.send(
      JSON.stringify({
        event: "error",
        message: "Failed to fetch users with last messages",
      })
    );
  }
}
