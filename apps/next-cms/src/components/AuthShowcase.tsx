import { useSession, signOut, signIn } from 'next-auth/react';
import { api } from '~/utils/api';

export function AuthShowcase() {
    const { data: sessionData } = useSession();

    const { data: secretMessage } = api.example.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined },
    );

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-2xl text-center">
                {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
            <button
                className="px-10 py-3 font-semibold no-underline transition rounded-full bg-text/10 hover:bg-text/20"
                onClick={() => {
                    if (sessionData) signOut();
                    else signIn();
                }}
            >
                {sessionData ? 'Sign out' : 'Sign in'}
            </button>
        </div>
    );
}
