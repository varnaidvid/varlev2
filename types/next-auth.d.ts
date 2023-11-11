import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            username: string;
            role: string;
            avatar: string;
            createdAt: string;
            updatedAt: string;
        } & DefaultSession["user"];
    }
}