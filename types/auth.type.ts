import { z } from "zod";
import { UserSchema } from "./user.type";

export const RegisterSchema = {
    body: z.object({
        name: UserSchema.shape.name,
        email: UserSchema.shape.email,
        password: UserSchema.shape.password.unwrap(),
    }),
} as const;

export const LoginSchema = {
    body: z.object({
        email: UserSchema.shape.email,
        password: UserSchema.shape.password.unwrap(),
    }),
} as const;

export const GoogleAuthSchema = {
    body: z.object({
        name: UserSchema.shape.name,
        email: UserSchema.shape.email,
        profileImageUrl: UserSchema.shape.profileImageUrl.optional(),
        googleId: UserSchema.shape.googleId.unwrap(),
    }),
} as const;

export type LoginInput = z.infer<typeof LoginSchema>;
export type GoogleAuthInput = z.infer<typeof GoogleAuthSchema>;