import { z } from "zod";
import { UserSchema } from "./user.type";

export const LoginSchema = {
    body: z.object({
        email: UserSchema.shape.email,
        password: UserSchema.shape.password.unwrap(),
    }),
} as const;

export type LoginInput = z.infer<typeof LoginSchema>;