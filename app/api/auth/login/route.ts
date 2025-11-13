import APIError from '@/lib/api/error';
import { LoginSchema } from '@/types/auth.type';
import { asyncHandler } from '@/lib/api/response';
import UserModel, { IUser } from '@/models/user.model';

export const POST = asyncHandler(
    async (_, __, data) => {
        const { email, password } = data.body;

        const user: IUser | null = await UserModel.findOne({ email });
        if (!user) return APIError.notFound('User not found');

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) return APIError.unauthorized('Invalid credentials');

        if (!user.isVerified) return APIError.forbidden('User email is not verified');

        return {
            data: user.toJSON(),
            message: 'Login successful'
        };
    },
    LoginSchema
);