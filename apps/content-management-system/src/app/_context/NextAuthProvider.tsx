'use client';

import { SessionProvider } from 'next-auth/react';

export function NextAuthProvider({ children }: React.PropsWithChildren) {
    return <SessionProvider>{children}</SessionProvider>;
}
