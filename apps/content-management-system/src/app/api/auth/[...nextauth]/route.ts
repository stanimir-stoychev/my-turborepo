import NextAuth from 'next-auth';
import { authOptions } from '@/app/_lib';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
