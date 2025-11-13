import APIError from '@/lib/api/error';
import { GoogleAuthSchema } from '@/types/auth.type';
import { asyncHandler } from '@/lib/api/response';
import UserModel, { IUser } from '@/models/user.model';

export const POST = asyncHandler(
    async (_, __, data) => {
        const user: IUser = await UserModel.findOneAndUpdate(
            { email: data.body.email },
            {
                $setOnInsert: {
                    ...data.body
                }
            },
            { new: true, upsert: true, runValidators: true }
        );

        if (!user) throw APIError.internal('Failed to login or create user');

        return {
            data: user.toJSON(),
            message: 'Login successful'
        };
    },
    GoogleAuthSchema
);