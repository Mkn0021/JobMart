import env from '@/config/env';
import APIError from './api/error';
import { Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { NextAuthOptions } from 'next-auth';
import type { SafeUser } from '@/types/user.type';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    secret: env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        }),
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
                        return null;
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
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    const response = await fetch(`${env.NEXTAUTH_URL}/api/auth/google`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            profileImageUrl: user.image,
                            googleId: account.providerAccountId,
                        })
                    });

                    if (!response.ok) {
                        return false;
                    }

                    const result = await response.json();
                    user.id = result.data.id;
                    user.isVerified = result.data.isVerified;
                    user.profileImageUrl = result.data.profileImageUrl;
                    user.educationLevel = result.data.educationLevel;

                    return true;
                } catch (error) {
                    console.error('Google sign-in error:', error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user, account }) {
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

            if (account) {
                token.provider = account.provider;
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