import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/prisma/db';

const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@example.com',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUniqueOrThrow({
                    where: { email: credentials.email },
                });

                if (await compare(credentials.password, user.password)) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.username,
                        isAdmin: user.isAdmin,
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            console.log("Session Callback", { session, token });
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    randomKey: "randomKey",
                },
            };
        },
        jwt: ({ token, user }) => {
            console.log("JWT Callback", { token, user });
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    randomKey: "randomKey",
                };
            }
            return token;
        },
    },
};

export default authOptions;