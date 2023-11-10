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
            name: 'credentials',
            credentials: {},
            async authorize(credentials: any) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUniqueOrThrow({
                    where: { username: credentials.username },
                });

                if (await compare(credentials.password, user.password)) {
                    return {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            // to debug session refresh
            console.log("Session Callback", { session, token });

            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,

                    randomKey: "randomKey", // any value can be added here to session
                },
            };
        },
        jwt: ({ token, user }) => {
            // to debug token refresh
            console.log("JWT Callback", { token, user });

            if (user) {
                return {
                    ...token,
                    id: user.id,
                };
            }
            return token;
        },
    },
};

export default authOptions;