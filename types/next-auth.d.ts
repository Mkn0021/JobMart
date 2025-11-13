import { SafeUser } from './user.type';

declare module 'next-auth' {
    interface Session {
        user: SafeUser;
    }

    interface User extends SafeUser { }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: Pick<SafeUser, 'id'
            | 'name'
            | 'email'
            | 'profileImageUrl'
            | 'isVerified'
            | 'educationLevel'
        >;
    }
}