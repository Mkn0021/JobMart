import APIError from '@/lib/api/error';
import { RegisterSchema } from '@/types/auth.type';
import { asyncHandler } from '@/lib/api/response';
import UserModel, { IUser } from '@/models/user.model';

export const POST = asyncHandler(
    async (_, __, data) => {
        const existingUser = await UserModel.findOne({ email: data.body.email });
        if (existingUser) throw APIError.conflict('User with this email already exists');


        const user: IUser = await UserModel.create({
            ...data.body
        })

        // TODO: Send verification email here

        return {
            data: user.toJSON(),
            message: 'Login successful'
        };
    },
    RegisterSchema
);