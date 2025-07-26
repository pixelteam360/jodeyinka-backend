import { UserRole } from "@prisma/client";
import { z } from "zod";

const CreateUserValidationSchema = z.object({
  fullName: z.string(),
  email: z.string().email("Invalid email address").min(1, "Email is required"), // Ensure email is provided and is valid
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.nativeEnum(UserRole, {
    message: "Role must be one of the following: EMPLOYER, AGENT, DRIVER",
  }),
});

const UserLoginValidationSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const userUpdateSchema = z.object({
  fullName: z.string().optional(),
});

const RatingSchema = z.object({
  rating: z.number(),
  message: z.string(),
  receiverId: z.string(),
});

export const UserValidation = {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
  userUpdateSchema,
  RatingSchema,
};
