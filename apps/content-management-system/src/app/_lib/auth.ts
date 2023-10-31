import { NextAuthOptions, getServerSession as getNextAuthServerSession } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import { env } from '@/env';

export const authOptions: NextAuthOptions = {
    // Secret for Next-auth, without this JWT encryption/decryption won't work
    secret: env.NEXTAUTH_SECRET,

    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: env.GITHUB_AUTH_CLIENT_ID,
            clientSecret: env.GITHUB_AUTH_CLIENT_SECRET,
        }),
    ],
};

export function getServerSession() {
    return getNextAuthServerSession(authOptions);
}
