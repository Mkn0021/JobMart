import env from '@/config/env';
import APIError from './api/error';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { NextAuthOptions } from 'next-auth';
import type { SafeUser } from '@/types/user.type';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    secret: env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw APIError.validation('Email and password are required');
                }

                try {
                    const response = await fetch(`${env.NEXTAUTH_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password
                        })
                    });

                    if (!response.ok) {
                        throw APIError.unauthorized('Invalid email or password');
                    }
                    const result = await response.json();

                    return result.data as SafeUser;
                } catch (error) {
                    if (error instanceof APIError) {
                        return null; // NextAuth expects null for auth failures
                    }
                    throw APIError.internal('Authentication failed');
                }
            }
        })
    ],
    session: {
        strategy: 'jwt' as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: '/signin',
        error: '/signin',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: user.id,
                    name: user.name!,
                    email: user.email!,
                    isVerified: user.isVerified,
                    profileImageUrl: user.profileImageUrl,
                    educationLevel: user.educationLevel,
                }
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
            if (token.user) {
                session.user = {
                    ...session.user,
                    ...token.user
                };
            }
            return session;
        },
    },
};