import { UserRole } from "@prisma/client";
import prisma from "../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../config";
export const initiateSuperAdmin = async () => {
  const hashedPassword=await bcrypt.hash('123456789',Number(config.bcrypt_salt_rounds))
  const payload: any = {
    fullName : "Super Admin",
    email: "super.admin@gmail.com",
    password: hashedPassword,
    role: UserRole.SUPER_ADMIN,
  };

  const isExistUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
      role: payload.role,
    },
  });

  if (isExistUser) return;

  await prisma.user.create({
    data: payload,
  });
};
