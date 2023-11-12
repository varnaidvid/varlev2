import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/prisma/db';
import { getCompitetorIdByUserId } from '../actions';

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
                    return user;
                }

                return null;
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, trigger, session, user }) => {
            if (trigger === "update" && session) {
                token.user = session

                return token
            }

            user && (token.user = user)
            return token
        },
        session: async ({ session, token }) => {
            session.user = token.user as any

            if (session.user.role === "diak") {
                const competitorId = await getCompitetorIdByUserId(session.user.id)
                competitorId?.id && (session.user.competitorId = competitorId.id)
            }

            return {
                ...session,
                "random": "random",
            }
        },
    },
};

export default authOptions;